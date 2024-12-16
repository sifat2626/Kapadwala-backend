import csvParser from 'csv-parser';
import { PassThrough } from 'stream';
import { Deal } from './deals.model';
import { Company } from '../Company/company.model';
import { Vendor } from '../Vendor/vendor.model';

interface CSVRow {
  title: string;
  percentage: number;
  type: string;
  vendorName: string;
  companyName: string;
  expiryDate: string;
  link: string;
}

// Process CSV Data
const processCSVData = async (buffer:any): Promise<string> => {
  const deals: CSVRow[] = [];

  // Parse CSV data from the buffer
  await new Promise<void>((resolve, reject) => {
    const bufferStream = new PassThrough();
    bufferStream.end(buffer);

    bufferStream
      .pipe(csvParser())
      .on('data', (row: CSVRow) => deals.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  const results = {
    createdDeals: 0,
    updatedDeals: 0,
    newCompanies: 0,
    newVendors: 0,
  };

  // Resolve or create companies and vendors in batches for efficiency
  const companyMap = new Map<string, string>();
  const vendorMap = new Map<string, string>();

  // Populate existing companies and vendors
  const existingCompanies = await Company.find();
  const existingVendors = await Vendor.find();

  existingCompanies.forEach((company) => companyMap.set(company.name, company._id));
  existingVendors.forEach((vendor) => vendorMap.set(vendor.name, vendor._id));

  for (const deal of deals) {
    const { title, percentage, type, vendorName, companyName, expiryDate, link } = deal;

    // Validate required fields
    if (!title || !percentage || !type || !vendorName || !companyName || !expiryDate || !link) {
      console.error(`Invalid deal entry, skipping: ${JSON.stringify(deal)}`);
      continue;
    }

    // Resolve or create the company
    let companyId = companyMap.get(companyName);
    if (!companyId) {
      const newCompany = await Company.create({
        name: companyName,
        description: `${companyName} auto-created from CSV`,
        logo: '',
        website: '',
      });
      companyId = newCompany._id;
      companyMap.set(companyName, companyId);
      results.newCompanies++;
    }

    // Resolve or create the vendor
    let vendorId = vendorMap.get(vendorName);
    if (!vendorId) {
      const newVendor = await Vendor.create({
        name: vendorName,
        logo: '',
        website: '',
      });
      vendorId = newVendor._id;
      vendorMap.set(vendorName, vendorId);
      results.newVendors++;
    }

    // Check if the deal already exists
    const existingDeal = await Deal.findOne({
      title,
      vendorId,
      companyId,
    });

    if (existingDeal) {
      existingDeal.percentage = percentage;
      // existingDeal.type = type;
      existingDeal.expiryDate = new Date(expiryDate);
      existingDeal.link = link;
      existingDeal.isActive = new Date(expiryDate) > new Date();
      await existingDeal.save();
      results.updatedDeals++;
    } else {
      await Deal.create({
        title,
        percentage,
        type,
        vendorId,
        companyId,
        expiryDate: new Date(expiryDate),
        link,
        isActive: new Date(expiryDate) > new Date(),
      });
      results.createdDeals++;
    }
  }

  return `Processed ${deals.length} deals.\nDetails: ${JSON.stringify(results)}`;
};

// Fetch All Deals
const getAllDeals = async (query: any): Promise<any> => {
  const { type, vendorName, companyName, page = 1, limit = 10 } = query;

  // Build filters dynamically
  const filters: any = {};
  if (type) filters.type = type;

  if (vendorName) filters.vendorId = await getVendorIdByName(vendorName);
  if (companyName) filters.companyId = await getCompanyIdByName(companyName);

  // Pagination setup
  const skip = (page - 1) * limit;

  const deals = await Deal.find(filters)
    .skip(skip)
    .limit(limit)
    .populate('vendorId')
    .populate('companyId');

  const total = await Deal.countDocuments(filters);

  return {
    meta: {
      total,
      limit,
      page,
    },
    data: deals,
  };
};

// Fetch Top Deals
const getTopDeals = async (): Promise<any[]> => {
  // Step 1: Find the best cashback deals
  const cashbackDeals = await Deal.aggregate([
    { $match: { type: 'cashback', isActive: true } }, // Only active cashback deals
    { $sort: { percentage: -1 } }, // Sort by highest percentage
    {
      $group: {
        _id: '$companyId', // Group by company
        bestCashbackDeal: { $first: '$$ROOT' }, // Pick the best cashback deal for each company
      },
    },
  ]);

  // Step 2: Find the best gift card deals
  const giftcardDeals = await Deal.aggregate([
    { $match: { type: 'giftcard', isActive: true } }, // Only active gift card deals
    { $sort: { percentage: -1 } }, // Sort by highest percentage
    {
      $group: {
        _id: '$companyId', // Group by company
        bestGiftcardDeal: { $first: '$$ROOT' }, // Pick the best gift card deal for each company
      },
    },
  ]);

  // Step 3: Find Amex and Chase deals
  const creditCardDeals = await Deal.aggregate([
    {
      $match: {
        type: 'creditcard',
        isActive: true,
        companyId: { $in: ['AmexID', 'ChaseID'] }, // Replace with actual Amex and Chase IDs
      },
    },
    { $sort: { percentage: -1 } }, // Sort by highest percentage
  ]);

  // Step 4: Combine all the information by company
  const topDealsByCompany: any[] = [];

  const cashbackMap = new Map<string, any>();
  const giftcardMap = new Map<string, any>();

  cashbackDeals.forEach((deal) => cashbackMap.set(deal._id.toString(), deal.bestCashbackDeal));
  giftcardDeals.forEach((deal) => giftcardMap.set(deal._id.toString(), deal.bestGiftcardDeal));

  const companyIds = [...new Set([...cashbackMap.keys(), ...giftcardMap.keys()])];
  const companies = await Company.find({ _id: { $in: companyIds } });

  for (const company of companies) {
    const companyId = company._id.toString();
    const bestCashbackDeal = cashbackMap.get(companyId);
    const bestGiftcardDeal = giftcardMap.get(companyId);

    // Filter credit card deals for this company
    const relevantCreditCardDeals = creditCardDeals.filter(
      (deal) => deal.companyId.toString() === companyId
    );

    // Determine the top rate for sorting
    const bestRate = Math.max(
      bestCashbackDeal?.percentage || 0,
      bestGiftcardDeal?.percentage || 0
    );

    topDealsByCompany.push({
      company: {
        id: companyId,
        name: company.name,
      },
      bestRate, // Use this for sorting
      bestCashbackDeal: bestCashbackDeal
        ? {
          vendor: await Vendor.findById(bestCashbackDeal.vendorId),
          percentage: bestCashbackDeal.percentage,
          link: bestCashbackDeal.link,
        }
        : null,
      bestGiftcardDeal: bestGiftcardDeal
        ? {
          vendor: await Vendor.findById(bestGiftcardDeal.vendorId),
          percentage: bestGiftcardDeal.percentage,
          link: bestGiftcardDeal.link,
        }
        : null,
      creditCardDeals: relevantCreditCardDeals.map((deal) => ({
        type: deal.type,
        percentage: deal.percentage,
        link: deal.link,
      })),
    });
  }

  // Step 5: Sort companies by the best rate in descending order
  return topDealsByCompany.sort((a, b) => b.bestRate - a.bestRate);
};



// Helper: Get Vendor ID by Name
const getVendorIdByName = async (name: string): Promise<string | null> => {
  const vendor = await Vendor.findOne({ name });
  return vendor ? vendor._id : null;
};

// Helper: Get Company ID by Name
const getCompanyIdByName = async (name: string): Promise<string | null> => {
  const company = await Company.findOne({ name });
  return company ? company._id : null;
};

export const DealServices = {
  getAllDeals,
  getTopDeals,
  processCSVData,
};

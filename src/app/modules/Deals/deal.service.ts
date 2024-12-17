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
const processCSVData = async (buffer: any): Promise<string> => {
  const deals: CSVRow[] = [];

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

  const companyMap = new Map<string, string>();
  const vendorMap = new Map<string, string>();

  const existingCompanies = await Company.find();
  const existingVendors = await Vendor.find();

  existingCompanies.forEach((company) => companyMap.set(company.name, company._id));
  existingVendors.forEach((vendor) => vendorMap.set(vendor.name, vendor._id));

  for (const deal of deals) {
    const { title, percentage, type, vendorName, companyName, expiryDate, link } = deal;

    if (!title || !percentage || !type || !vendorName || !companyName || !expiryDate || !link) {
      console.error(`Invalid deal entry, skipping: ${JSON.stringify(deal)}`);
      continue;
    }

    let companyId = companyMap.get(companyName);
    if (!companyId) {
      const newCompany = await Company.create({ name: companyName, logo: '', website: '' });
      companyId = newCompany._id;
      companyMap.set(companyName, companyId);
      results.newCompanies++;
    }

    let vendorId = vendorMap.get(vendorName);
    if (!vendorId) {
      const newVendor = await Vendor.create({ name: vendorName, logo: '', website: '' });
      vendorId = newVendor._id;
      vendorMap.set(vendorName, vendorId);
      results.newVendors++;
    }

    const existingDeal = await Deal.findOne({ title, vendorId, companyId });

    if (existingDeal) {
      existingDeal.percentage = percentage;
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

  const filters: any = {};
  if (type) filters.type = type;

  if (vendorName) {
    const vendorId = await getVendorIdByName(vendorName);
    if (vendorId) filters.vendorId = vendorId;
  }

  if (companyName) {
    const companyId = await getCompanyIdByName(companyName);
    if (companyId) filters.companyId = companyId;
  }

  const skip = (page - 1) * limit;

  const deals = await Deal.find(filters)
    .skip(skip)
    .limit(limit)
    .populate('vendorId', 'name logo website') // Populate vendor details
    .populate('companyId', 'name'); // Populate company name

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
  const cashbackDeals = await Deal.aggregate([
    { $match: { type: 'cashback', isActive: true } },
    { $sort: { percentage: -1 } },
    { $group: { _id: '$companyId', bestCashbackDeal: { $first: '$$ROOT' } } },
  ]);

  const giftcardDeals = await Deal.aggregate([
    { $match: { type: 'giftcard', isActive: true } },
    { $sort: { percentage: -1 } },
    { $group: { _id: '$companyId', bestGiftcardDeal: { $first: '$$ROOT' } } },
  ]);

  const creditCardDeals = await Deal.find({ type: 'creditcard', isActive: true })
    .sort({ percentage: -1 })
    .populate('vendorId', 'name logo website'); // Fetch vendor details

  const cashbackMap = new Map<string, any>();
  const giftcardMap = new Map<string, any>();
  const creditCardMap = new Map<string, any[]>();

  cashbackDeals.forEach((deal) => cashbackMap.set(deal._id.toString(), deal.bestCashbackDeal));
  giftcardDeals.forEach((deal) => giftcardMap.set(deal._id.toString(), deal.bestGiftcardDeal));

  creditCardDeals.forEach((deal) => {
    const companyId = deal.companyId.toString();
    if (!creditCardMap.has(companyId)) creditCardMap.set(companyId, []);
    creditCardMap.get(companyId)!.push({
      vendor: deal.vendorId, // Includes vendor name, logo, and website
      percentage: deal.percentage,
      link: deal.link,
    });
  });

  const companyIds = [...new Set([...cashbackMap.keys(), ...giftcardMap.keys(), ...creditCardMap.keys()])];
  const companies = await Company.find({ _id: { $in: companyIds } });

  return companies.map((company) => {
    const companyId = company._id.toString();
    return {
      company: { id: companyId, name: company.name },
      bestCashbackDeal: cashbackMap.get(companyId) || null,
      bestGiftcardDeal: giftcardMap.get(companyId) || null,
      creditCardDeals: creditCardMap.get(companyId) || [],
    };
  });
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

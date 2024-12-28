import { Company } from './company.model';
import { TCompany } from './company.type';
import { Deal } from '../Deals/deals.model';
import { Buffer } from 'buffer';
import { Readable } from 'stream';
import csvParser from 'csv-parser';

const createCompany = async (data: TCompany) => {
  const company = await Company.create(data);
  return company;
};

const uploadCompaniesFromCSV = async (buffer: Buffer) => {
  const companies: TCompany[] = [];

  // Parse the CSV buffer
  await new Promise<void>((resolve, reject) => {
    const stream = Readable.from(buffer);
    stream
      .pipe(csvParser())
      .on('data', (row) => {
        companies.push({
          name: row.name,
          logo: row.logo || '', // Optional field
          website: row.website || '', // Optional field
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  const results = {
    createdCompanies: 0,
    updatedCompanies: 0,
  };

  // Iterate over the parsed companies and add/update them in the database
  for (const company of companies) {
    const existingCompany = await Company.findOne({ name: company.name });

    console.log('existingCompany', existingCompany);

    if (existingCompany) {
      // Update the existing company
      existingCompany.logo = company.logo || existingCompany.logo;
      existingCompany.website = company.website || existingCompany.website;
      await existingCompany.save();
      results.updatedCompanies++;
    } else {
      // Create a new company
      await Company.create(company);
      results.createdCompanies++;
    }
  }

  return results;
};


const getAllCompanies = async (query: any) => {
  const { page = 1, limit = 10, name } = query;
  const skip = (page - 1) * Number(limit);

  const filter: any = {};
  if (name) {
    filter.name = { $regex: name, $options: 'i' }; // Case-insensitive partial search
  }

  const companies = await Company.find(filter)
    .skip(skip)
    .limit(Number(limit));
  const total = await Company.countDocuments();

  return {
    meta: {
      total,
      limit: Number(limit),
      page: Number(page),
      totalPage: Math.ceil(total / Number(limit)),
    },
    data: companies,
  };
};

const getCompanyById = async (id: string) => {
  const company = await Company.findById(id);
  if (!company) throw new Error('Company not found');
  return company;
};

const getDealsByCompanyName = async (companyName: string, query: any) => {
  const { page = 1, limit = 10, type = null } = query;
  const skip = (page - 1) * Number(limit);

  // Find the company by name
  const company = await Company.findOne({ name: { $regex: companyName, $options: 'i' } });
  if (!company) throw new Error('Company not found');

  const currentDate = new Date();

  // Fetch all non-expired deals related to this company with pagination
  const queryObj: any = {
    companyId: company._id,
    expiryDate: { $gte: currentDate },
  };

  // Add 'type' to the query if it is provided
  if (type) {
    queryObj.type = type;
  }

  // Fetch all non-expired deals related to this company with pagination
  const deals = await Deal.find(queryObj)
    .sort({percentage:-1})
    .skip(skip)
    .limit(Number(limit))
    .populate('vendorId', 'name logo website')
    .populate('companyId', 'name');

  const total = await Deal.countDocuments(queryObj);

  return {
    meta: {
      total,
      limit: Number(limit),
      page: Number(page),
      totalPage: Math.ceil(total / Number(limit)),
    },
    data: deals,
  };
};

const getActiveDealsByCompany = async (companyName: string, type?: string, query: any = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * Number(limit);

  // Find the company by name
  const company = await Company.findOne({ name: companyName });
  if (!company) throw new Error('Company not found');

  const currentDate = new Date();

  // Define the base query
  const filters: any = {
    companyId: company._id,
    isActive: true,
    expiryDate: { $gte: currentDate },
  };

  if (type) {
    filters.type = type;
  }

  const deals = await Deal.find(filters)
    .skip(skip)
    .limit(Number(limit))
    .sort({ percentage: -1 })
    .populate('vendorId', 'name logo website')
    .populate('companyId', 'name');

  const total = await Deal.countDocuments(filters);

  return {
    meta: {
      total,
      limit: Number(limit),
      page: Number(page),
      totalPage: Math.ceil(total / Number(limit)),
    },
    data: deals,
  };
};

const updateCompany = async (id: string, data: Partial<TCompany>) => {
  const company = await Company.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!company) throw new Error('Company not found');
  return company;
};

const deleteCompany = async (id: string) => {
  // Delete all related deals first
  await Deal.deleteMany({ companyId: id });

  // Find and delete the company
  const company = await Company.findByIdAndDelete(id);
  if (!company) throw new Error('Company not found');
};

export const CompanyService = {
  createCompany,
  uploadCompaniesFromCSV,
  getAllCompanies,
  getCompanyById,
  getDealsByCompanyName,
  getActiveDealsByCompany,
  updateCompany,
  deleteCompany,
};

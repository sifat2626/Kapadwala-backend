import { Company } from './company.model';
import { TCompany } from './company.type';
import { Deal } from '../Deals/deals.model';

const createCompany = async (data: TCompany) => {
  const company = await Company.create(data);
  return company;
};

const getAllCompanies = async (query: any) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * Number(limit);

  const companies = await Company.find()
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
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * Number(limit);

  // Find the company by name
  const company = await Company.findOne({ name: companyName });
  if (!company) throw new Error('Company not found');

  const currentDate = new Date();

  // Fetch all non-expired deals related to this company with pagination
  const deals = await Deal.find({
    companyId: company._id,
    expiryDate: { $gte: currentDate },
  })
    .skip(skip)
    .limit(Number(limit))
    .populate('vendorId', 'name logo website')
    .populate('companyId', 'name');

  const total = await Deal.countDocuments({
    companyId: company._id,
    expiryDate: { $gte: currentDate },
  });

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
  getAllCompanies,
  getCompanyById,
  getDealsByCompanyName,
  getActiveDealsByCompany,
  updateCompany,
  deleteCompany,
};

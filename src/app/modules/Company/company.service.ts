import { Company } from './company.model';
import { TCompany } from './company.type';
import { Deal } from '../Deals/deals.model'

const createCompany = async (data: TCompany) => {
  const company = await Company.create(data);
  return company;
};

const getAllCompanies = async (query: any) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const companies = await Company.find()
    .skip(skip)
    .limit(Number(limit));
  const total = await Company.countDocuments();

  return { companies, total };
};

const getCompanyById = async (id: string) => {
  const company = await Company.findById(id);
  if (!company) throw new Error('Company not found');
  return company;
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
  updateCompany,
  deleteCompany,
};

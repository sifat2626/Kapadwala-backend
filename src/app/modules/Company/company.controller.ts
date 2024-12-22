import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { CompanyService } from './company.service';

const createCompany: RequestHandler = catchAsync(async (req, res) => {
  const company = await CompanyService.createCompany(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Company created successfully.',
    data: company,
  });
});

const getAllCompanies: RequestHandler = catchAsync(async (req, res) => {
  const companies = await CompanyService.getAllCompanies(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Companies retrieved successfully.',
    meta: companies.meta, // Include meta information
    data: companies.data, // Companies data
  });
});

const getCompanyById: RequestHandler = catchAsync(async (req, res) => {
  const company = await CompanyService.getCompanyById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company retrieved successfully.',
    data: company,
  });
});

const getDealsByCompanyName: RequestHandler = catchAsync(async (req, res) => {
  const { companyName } = req.params;
  const deals = await CompanyService.getDealsByCompanyName(companyName, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Deals for company '${companyName}' retrieved successfully.`,
    meta: deals.meta, // Include meta information
    data: deals.data, // Deals data
  });
});

const getActiveDealsByCompany: RequestHandler = catchAsync(async (req, res) => {
  const { companyName } = req.params;
  const { type } = req.query; // Optional type filter

  const deals = await CompanyService.getActiveDealsByCompany(companyName, type as string, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Active deals for company '${companyName}'${type ? ` of type '${type}'` : ''} retrieved successfully.`,
    meta: deals.meta, // Include meta information
    data: deals.data, // Deals data
  });
});

const updateCompany: RequestHandler = catchAsync(async (req, res) => {
  const company = await CompanyService.updateCompany(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company updated successfully.',
    data: company,
  });
});

const deleteCompany: RequestHandler = catchAsync(async (req, res) => {
  await CompanyService.deleteCompany(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: 'Company deleted successfully.',
    data: '',
  });
});

const uploadCompaniesFromCSV: RequestHandler = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new Error('No file uploaded.');
  }

  // Parse the CSV file
  const buffer = req.file.buffer;
  const companies = await CompanyService.uploadCompaniesFromCSV(buffer);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Companies uploaded successfully.',
    data: companies, // Return the created/updated companies
  });
});

export const CompanyController = {
  createCompany,
  uploadCompaniesFromCSV,
  getAllCompanies,
  getCompanyById,
  getDealsByCompanyName,
  getActiveDealsByCompany,
  updateCompany,
  deleteCompany,
};

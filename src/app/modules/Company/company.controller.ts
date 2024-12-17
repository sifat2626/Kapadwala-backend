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
    data: companies,
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
    data:''
  });
});

export const CompanyController = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};

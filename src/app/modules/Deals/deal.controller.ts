import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DealServices } from './deal.service';

// Upload and process deals from a CSV file
const uploadDealsFromCSV: RequestHandler = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new Error('No file uploaded');
  }


  // Process the uploaded file
  const result = await DealServices.processCSVData(req.file.buffer); // Assuming processCSVData accepts a Buffer

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'CSV processed successfully.',
    data: result,
  });
});

// Get all deals
const getAllDeals: RequestHandler = catchAsync(async (req, res) => {
  const deals = await DealServices.getAllDeals(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deals retrieved successfully.',
    data: deals,
  });
});

const getAllActiveDeals: RequestHandler = catchAsync(async (req, res) => {
  const activeDeals = await DealServices.getAllActiveDeals();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All active deals retrieved successfully.',
    data: activeDeals,
  });
});

// Get top deals
const getTopDeals: RequestHandler = catchAsync(async (req, res) => {
  const topDeals = await DealServices.getTopDeals();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Top deals retrieved successfully.',
    data: topDeals,
  });
});

const getBestCashbackRateByCompany: RequestHandler = catchAsync(async (req, res) => {
  const { companyName } = req.params;

  const data = await DealServices.getBestCashbackRateByCompany(companyName);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Best cashback rate for '${companyName}' retrieved successfully.`,
    data,
  });
});

const getBestGiftcardRateByCompany: RequestHandler = catchAsync(async (req, res) => {
  const { companyName } = req.params;

  const data = await DealServices.getBestGiftcardRateByCompany(companyName);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Best gift card rate for '${companyName}' retrieved successfully.`,
    data,
  });
});

const getActiveCashbackDeals: RequestHandler = catchAsync(async (req, res) => {
  const deals = await DealServices.getActiveCashbackDeals();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active cashback deals retrieved successfully.',
    data: deals,
  });
});

const getActiveGiftcardDeals: RequestHandler = catchAsync(async (req, res) => {
  const deals = await DealServices.getActiveGiftcardDeals();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active gift card deals retrieved successfully.',
    data: deals,
  });
});

const getActiveCreditcardDeals: RequestHandler = catchAsync(async (req, res) => {
  const deals = await DealServices.getActiveCreditcardDeals();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active credit card deals retrieved successfully.',
    data: deals,
  });
});

const getExpiringCreditcardDealsByVendor: RequestHandler = catchAsync(async (req, res) => {
  const { vendorName } = req.params;

  const deals = await DealServices.getExpiringCreditcardDealsByVendor(vendorName);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Expiring credit card deals for vendor '${vendorName}' retrieved successfully.`,
    data: deals,
  });
});

// Delete old deals by exact date or days
const deleteOldDeals: RequestHandler = catchAsync(async (req, res) => {
  const { date, days } = req.query;

  const result = await DealServices.deleteOldDeals(date as string, days as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result.deletedCount,
  });
});

export const DealControllers = {
  uploadDealsFromCSV,
  getAllActiveDeals,
  getAllDeals,
  getTopDeals,
  getBestCashbackRateByCompany,
  getBestGiftcardRateByCompany,
  getActiveGiftcardDeals,
  getActiveCashbackDeals,
  getActiveCreditcardDeals,
  getExpiringCreditcardDealsByVendor,
  deleteOldDeals
};

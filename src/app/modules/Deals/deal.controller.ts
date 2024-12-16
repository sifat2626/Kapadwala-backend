import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DealServices } from './deal.service'

// Upload deals from a CSV file
const uploadDealsFromCSV: RequestHandler = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new Error('No file uploaded');
  }

  // Process the uploaded file
  const result = await DealServices.processCSV(req.file.path);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deals uploaded and processed successfully.',
    data: result,
  });
});

// Other controllers (getAllDeals, getTopDeals, etc.)
const getAllDeals: RequestHandler = catchAsync(async (req, res) => {
  const result = await DealServices.getAllDeals(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deals retrieved successfully.',
    data: result,
  });
});

const getTopDeals: RequestHandler = catchAsync(async (req, res) => {
  const result = await DealServices.getTopDeals();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Top deals retrieved successfully.',
    data: result,
  });
});

export const DealControllers = {
  uploadDealsFromCSV,
  getAllDeals,
  getTopDeals,
};

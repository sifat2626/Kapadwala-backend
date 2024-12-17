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

export const DealControllers = {
  uploadDealsFromCSV,
  getAllActiveDeals,
  getAllDeals,
  getTopDeals,
};

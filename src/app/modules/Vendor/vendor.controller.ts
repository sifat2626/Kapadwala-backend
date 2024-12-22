import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { VendorService } from './vendor.service';

const createVendor: RequestHandler = catchAsync(async (req, res) => {
  const vendor = await VendorService.createVendor(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Vendor created successfully.',
    data: vendor,
  });
});

const uploadVendorsFromCSV: RequestHandler = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new Error('No file uploaded.');
  }

  // Parse the CSV file
  const buffer = req.file.buffer;
  const vendors = await VendorService.uploadVendorsFromCSV(buffer);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Vendors uploaded successfully.',
    data: vendors, // Return the created/updated vendors
  });
});

const getAllVendors: RequestHandler = catchAsync(async (req, res) => {
  const vendors = await VendorService.getAllVendors(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendors retrieved successfully.',
    meta: vendors.meta, // Include meta information
    data: vendors.data, // Vendor data
  });
});

const getVendorById: RequestHandler = catchAsync(async (req, res) => {
  const vendor = await VendorService.getVendorById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor retrieved successfully.',
    data: vendor,
  });
});

const getDealsByVendorName: RequestHandler = catchAsync(async (req, res) => {
  const { vendorName } = req.params;
  const deals = await VendorService.getDealsByVendorName(vendorName, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Deals for vendor '${vendorName}' retrieved successfully.`,
    meta: deals.meta, // Include meta information
    data: deals.data, // Deals data
  });
});

const updateVendor: RequestHandler = catchAsync(async (req, res) => {
  const vendor = await VendorService.updateVendor(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor updated successfully.',
    data: vendor,
  });
});

const deleteVendor: RequestHandler = catchAsync(async (req, res) => {
  await VendorService.deleteVendor(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: 'Vendor deleted successfully.',
    data: '',
  });
});

export const VendorController = {
  createVendor,
  uploadVendorsFromCSV,
  getAllVendors,
  getVendorById,
  getDealsByVendorName,
  updateVendor,
  deleteVendor,
};

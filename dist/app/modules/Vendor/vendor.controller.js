"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const vendor_service_1 = require("./vendor.service");
const createVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_service_1.VendorService.createVendor(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Vendor created successfully.',
        data: vendor,
    });
}));
const uploadVendorsFromCSV = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new Error('No file uploaded.');
    }
    // Parse the CSV file
    const buffer = req.file.buffer;
    const vendors = yield vendor_service_1.VendorService.uploadVendorsFromCSV(buffer);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Vendors uploaded successfully.',
        data: vendors, // Return the created/updated vendors
    });
}));
const getAllVendors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield vendor_service_1.VendorService.getAllVendors(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Vendors retrieved successfully.',
        meta: vendors.meta, // Include meta information
        data: vendors.data, // Vendor data
    });
}));
const getVendorById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_service_1.VendorService.getVendorById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Vendor retrieved successfully.',
        data: vendor,
    });
}));
const getDealsByVendorName = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vendorName } = req.params;
    const deals = yield vendor_service_1.VendorService.getDealsByVendorName(vendorName, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Deals for vendor '${vendorName}' retrieved successfully.`,
        meta: deals.meta, // Include meta information
        data: deals.data, // Deals data
    });
}));
const updateVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_service_1.VendorService.updateVendor(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Vendor updated successfully.',
        data: vendor,
    });
}));
const deleteVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield vendor_service_1.VendorService.deleteVendor(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.NO_CONTENT,
        success: true,
        message: 'Vendor deleted successfully.',
        data: '',
    });
}));
exports.VendorController = {
    createVendor,
    uploadVendorsFromCSV,
    getAllVendors,
    getVendorById,
    getDealsByVendorName,
    updateVendor,
    deleteVendor,
};

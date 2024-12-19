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
exports.DealControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const deal_service_1 = require("./deal.service");
// Upload and process deals from a CSV file
const uploadDealsFromCSV = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new Error('No file uploaded');
    }
    // Process the uploaded file
    const result = yield deal_service_1.DealServices.processCSVData(req.file.buffer); // Assuming processCSVData accepts a Buffer
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CSV processed successfully.',
        data: result,
    });
}));
// Get all deals
const getAllDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deals = yield deal_service_1.DealServices.getAllDeals(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Deals retrieved successfully.',
        data: deals,
    });
}));
const getAllActiveDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activeDeals = yield deal_service_1.DealServices.getAllActiveDeals();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All active deals retrieved successfully.',
        data: activeDeals,
    });
}));
// Get top deals
const getTopDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topDeals = yield deal_service_1.DealServices.getTopDeals();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Top deals retrieved successfully.',
        data: topDeals,
    });
}));
const getBestCashbackRateByCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName } = req.params;
    const data = yield deal_service_1.DealServices.getBestCashbackRateByCompany(companyName);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Best cashback rate for '${companyName}' retrieved successfully.`,
        data,
    });
}));
const getBestGiftcardRateByCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName } = req.params;
    const data = yield deal_service_1.DealServices.getBestGiftcardRateByCompany(companyName);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Best gift card rate for '${companyName}' retrieved successfully.`,
        data,
    });
}));
const getActiveCashbackDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deals = yield deal_service_1.DealServices.getActiveCashbackDeals();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Active cashback deals retrieved successfully.',
        data: deals,
    });
}));
const getActiveGiftcardDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deals = yield deal_service_1.DealServices.getActiveGiftcardDeals();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Active gift card deals retrieved successfully.',
        data: deals,
    });
}));
const getActiveCreditcardDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deals = yield deal_service_1.DealServices.getActiveCreditcardDeals();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Active credit card deals retrieved successfully.',
        data: deals,
    });
}));
const getExpiringCreditcardDealsByVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vendorName } = req.params;
    const deals = yield deal_service_1.DealServices.getExpiringCreditcardDealsByVendor(vendorName);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Expiring credit card deals for vendor '${vendorName}' retrieved successfully.`,
        data: deals,
    });
}));
// Delete old deals by exact date or days
const deleteOldDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, days } = req.query;
    const result = yield deal_service_1.DealServices.deleteOldDeals(date, days);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: result.deletedCount,
    });
}));
exports.DealControllers = {
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

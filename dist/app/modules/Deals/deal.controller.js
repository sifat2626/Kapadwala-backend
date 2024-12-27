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
const user_model_1 = require("../User/user.model");
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
    var _a;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const deals = yield deal_service_1.DealServices.getAllDeals(Object.assign(Object.assign({}, req.query), { page, limit }));
    let filteredDeals = deals;
    // Limit deals to the first two if the user is not subscribed
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isSubscribed)) {
        filteredDeals = Object.assign(Object.assign({}, deals), { data: deals.data.slice(0, 2) });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Deals retrieved successfully.',
        data: filteredDeals,
    });
}));
const getAllActiveDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const activeDeals = yield deal_service_1.DealServices.getAllActiveDeals({ page, limit });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All active deals retrieved successfully.',
        data: activeDeals,
    });
}));
// Get top deals
const getTopDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const topDeals = yield deal_service_1.DealServices.getTopDeals({ page, limit });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Top deals retrieved successfully.',
        data: topDeals,
    });
}));
const getBestCashbackRateByCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName } = req.params;
    const page = Number(req.query.page) || 1; // Default to page 1 if not provided
    const limit = Number(req.query.limit) || 10; // Default to limit 10 if not provided
    const cashbackRates = yield deal_service_1.DealServices.getBestCashbackRateByCompany(companyName, page, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Best cashback rates for '${companyName}' retrieved successfully.`,
        data: cashbackRates,
    });
}));
const getBestGiftcardRateByCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName } = req.params;
    const page = Number(req.query.page) || 1; // Default to page 1 if not provided
    const limit = Number(req.query.limit) || 10; // Default to limit 10 if not provided
    const giftcardRates = yield deal_service_1.DealServices.getBestGiftcardRateByCompany(companyName, page, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Best gift card rates for '${companyName}' retrieved successfully.`,
        data: giftcardRates,
    });
}));
const getActiveCashbackDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1; // Default to page 1 if not provided
    const limit = Number(req.query.limit) || 10; // Default to limit 10 if not provided
    const deals = yield deal_service_1.DealServices.getActiveCashbackDeals(page, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Active cashback deals retrieved successfully.',
        data: deals,
    });
}));
const getActiveGiftcardDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1; // Default to page 1 if not provided
    const limit = Number(req.query.limit) || 10; // Default to limit 10 if not provided
    const deals = yield deal_service_1.DealServices.getActiveGiftcardDeals(page, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Active gift card deals retrieved successfully.',
        data: deals,
    });
}));
const getActiveCreditcardDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1; // Default to page 1 if not provided
    const limit = Number(req.query.limit) || 10; // Default to limit 10 if not provided
    const deals = yield deal_service_1.DealServices.getActiveCreditcardDeals(page, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Active credit card deals retrieved successfully.',
        data: deals,
    });
}));
const getExpiringCreditcardDealsByVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vendorName } = req.params;
    const page = Number(req.query.page) || 1; // Default to page 1 if not provided
    const limit = Number(req.query.limit) || 10; // Default to limit 10 if not provided
    const deals = yield deal_service_1.DealServices.getExpiringCreditcardDealsByVendor(vendorName, page, limit);
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
const getAllCreditcardDeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const deals = yield deal_service_1.DealServices.getAllCreditcardDeals({ page, limit });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All credit card deals retrieved successfully.',
        data: deals,
    });
}));
const getTopDealsFromFavorites = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.UNAUTHORIZED,
            success: false,
            message: 'User is not authenticated.',
            data: null,
        });
    }
    // Fetch the user's favorite companies and credit card vendors
    const user = yield user_model_1.User.findById(userId)
        .populate('favorites', '_id')
        .populate('favoriteCreditCardVendors', '_id');
    if (!user || user.favorites.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'No favorite companies found for the user.',
            data: [],
        });
    }
    // Get all top deals
    const allTopDeals = yield deal_service_1.DealServices.getTopDeals();
    // Extract favorite company and vendor IDs
    const favoriteCompanyIds = user.favorites.map((favorite) => favorite._id.toString());
    const favoriteCreditCardVendorIds = user.favoriteCreditCardVendors.map((vendor) => vendor._id.toString());
    // Filter top deals by favorite company IDs
    const filteredDeals = allTopDeals.data
        .map((deal) => {
        // Filter credit card deals to include only those from favorite vendors
        const filteredCreditCardDeals = deal.creditCardDeals.filter((creditCardDeal) => favoriteCreditCardVendorIds.includes(creditCardDeal.vendor._id.toString()));
        // Return the deal with the filtered credit card deals
        return Object.assign(Object.assign({}, deal), { creditCardDeals: filteredCreditCardDeals });
    })
        .filter((deal) => {
        // Ensure the company is in the user's favorite companies
        return (favoriteCompanyIds.includes(deal.company.id.toString()) ||
            deal.creditCardDeals.length > 0); // Include only if there are valid credit card deals
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Top deals from favorite companies retrieved successfully.',
        data: filteredDeals,
    });
}));
// const getTopDealsFromFavorites: RequestHandler = catchAsync(async (req, res) => {
//   const userId = req.user?._id;
//   if (!userId) {
//     return sendResponse(res, {
//       statusCode: httpStatus.UNAUTHORIZED,
//       success: false,
//       message: 'User is not authenticated.',
//       data: null,
//     });
//   }
//   const topDeals = await DealServices.getTopDealsFromFavorites(userId);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Top deals from favorite companies retrieved successfully.',
//     data: topDeals,
//   });
// });
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
    deleteOldDeals,
    getAllCreditcardDeals,
    getTopDealsFromFavorites,
};

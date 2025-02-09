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
exports.UserControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
// Create a new user
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.createUserIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'User created successfully.',
        data: result,
    });
}));
// Get all users with query parameters for filtering
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getAllUsersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users retrieved successfully.',
        meta: result.meta, // Include meta information
        data: result.result,
    });
}));
// Get the currently logged-in user's information
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const result = yield user_service_1.UserServices.getMe(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User retrieved successfully.',
        data: result,
    });
}));
// Update a user's role
const updateUserRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserServices.updateUserRoleIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User role updated successfully.',
        data: result,
    });
}));
// Delete a user
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserServices.deleteUserIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User deleted successfully.',
        data: result,
    });
}));
// Subscribe a user
const subscribeUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserServices.subscribeUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User subscribed successfully.',
        data: result,
    });
}));
// Add a company to the user's favorites
const addFavoriteCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { companyId } = req.params;
    const user = yield user_service_1.UserServices.addFavoriteCompany(userId, companyId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Company added to favorites successfully.',
        data: (user === null || user === void 0 ? void 0 : user.favorites) || [],
    });
}));
// Add a credit card vendor to the user's favorites
const addFavoriteCreditCardVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { vendorId } = req.params;
    const user = yield user_service_1.UserServices.addFavoriteCreditCardVendor(userId, vendorId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Vendor added to favorites successfully.',
        data: (user === null || user === void 0 ? void 0 : user.favoriteCreditCardVendors) || [],
    });
}));
// Remove a company from the user's favorites
const removeFavoriteCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { companyId } = req.params;
    const user = yield user_service_1.UserServices.removeFavoriteCompany(userId, companyId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Company removed from favorites successfully.',
        data: (user === null || user === void 0 ? void 0 : user.favorites) || [],
    });
}));
// Remove a credit card vendor from the user's favorites
const removeFavoriteCreditCardVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { vendorId } = req.params;
    const user = yield user_service_1.UserServices.removeFavoriteCreditCardVendor(userId, vendorId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Vendor removed from favorites successfully.',
        data: (user === null || user === void 0 ? void 0 : user.favoriteCreditCardVendors) || [],
    });
}));
// Get all favorite companies for the logged-in user
const getAllFavoriteCompanies = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield user_service_1.UserServices.getAllFavoriteCompanies(userId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Favorite companies retrieved successfully.',
        meta: result.meta,
        data: result.data,
    });
}));
// Get all favorite credit card vendors for the logged-in user
const getAllFavoriteCreditCardVendors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield user_service_1.UserServices.getAllFavoriteCreditCardVendors(userId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Favorite credit card vendors retrieved successfully.',
        meta: result.meta,
        data: result.data,
    });
}));
// Subscribe a user to the newsletter
const subscribeToNewsletter = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { email } = req.body;
    const result = yield user_service_1.UserServices.subscribeToNewsletter(userId, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Subscribed to newsletter successfully.',
        data: result,
    });
}));
// Unsubscribe a user from the newsletter
const unsubscribeFromNewsletter = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield user_service_1.UserServices.unsubscribeFromNewsletter(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Unsubscribed from newsletter successfully.',
        data: result,
    });
}));
exports.UserControllers = {
    createUser,
    getAllUsers,
    getMe,
    updateUserRole,
    deleteUser,
    subscribeUser,
    addFavoriteCompany,
    removeFavoriteCompany,
    getAllFavoriteCompanies,
    addFavoriteCreditCardVendor,
    removeFavoriteCreditCardVendor,
    getAllFavoriteCreditCardVendors,
    subscribeToNewsletter,
    unsubscribeFromNewsletter,
};

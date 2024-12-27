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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const company_model_1 = require("../Company/company.model");
const returnWithMeta_1 = require("../../utils/returnWithMeta");
const vendor_model_1 = require("../Vendor/vendor.model");
const createUserIntoDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.create(userData);
});
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, page = 1 } = query;
    const limitNum = Number(limit);
    const pageNum = Number(page);
    const skip = (pageNum - 1) * limitNum;
    const result = yield user_model_1.User.find().limit(limitNum).skip(skip);
    const total = yield user_model_1.User.countDocuments();
    return {
        meta: {
            total,
            limit: limitNum,
            page: pageNum,
            totalPage: Math.ceil(total / limitNum), // Include total pages
        },
        result,
    };
});
const getMe = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findOne({ email });
});
const updateUserRoleIntoDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findByIdAndUpdate(id, data, { new: true });
});
const deleteUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findByIdAndDelete(id);
});
const subscribeUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user)
        throw new Error('User not found');
    user.isSubscribed = true;
    user.subscriptionDate = new Date();
    yield user.save();
    return user;
});
const subscribeToNewsletter = (userId, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new Error('User not found');
    user.isSubscribedToNewsletter = true;
    user.newsLetterEmail = email;
    yield user.save();
    return user;
});
const unsubscribeFromNewsletter = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new Error('User not found');
    user.isSubscribedToNewsletter = false;
    user.newsLetterEmail = '';
    yield user.save();
    return user;
});
const addFavoriteCompany = (userId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield company_model_1.Company.findById(companyId);
    if (!company)
        throw new Error('Company not found');
    const user = yield user_model_1.User.findById(userId).populate('favorites', 'name');
    if (!user)
        throw new Error('User not found');
    if (user.favorites.length >= 20) {
        throw new Error('You can only have up to 20 favorite companies.');
    }
    return yield user_model_1.User.findByIdAndUpdate(userId, { $addToSet: { favorites: companyId } }, // Prevent duplicates
    { new: true }).populate('favorites', 'name');
});
const addFavoriteCreditCardVendor = (userId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_model_1.Vendor.findById(vendorId);
    if (!vendor)
        throw new Error('Vendor not found');
    const user = yield user_model_1.User.findById(userId).populate('favorites', 'name');
    if (!user)
        throw new Error('User not found');
    if (user.favorites.length >= 20) {
        throw new Error('You can only have up to 20 favorite companies.');
    }
    return yield user_model_1.User.findByIdAndUpdate(userId, { $addToSet: { favoriteCreditCardVendors: vendorId } }, // Prevent duplicates
    { new: true }).populate('favorites', 'name');
});
const removeFavoriteCompany = (userId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findByIdAndUpdate(userId, { $pull: { favorites: companyId } }, // Remove the company ID
    { new: true }).populate('favorites', 'name');
});
const removeFavoriteCreditCardVendor = (userId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findByIdAndUpdate(userId, { $pull: { favoriteCreditCardVendors: vendorId } }, // Remove the vendor ID
    { new: true }).populate('favorites', 'name');
});
const getAllFavoriteCompanies = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { limit = 10, page = 1 } = query;
    const limitNum = Number(limit);
    const pageNum = Number(page);
    const skip = (pageNum - 1) * limitNum;
    const user = yield user_model_1.User.findById(userId)
        .populate({
        path: 'favorites',
        select: 'name description logo website',
        options: { skip, limit: limitNum },
    })
        .select('favorites');
    if (!user)
        throw new Error('User not found');
    const total = ((_a = user.favorites) === null || _a === void 0 ? void 0 : _a.length) || 0;
    return (0, returnWithMeta_1.returnWithMeta)({ total, limit: limitNum, page: pageNum }, user.favorites);
});
const getAllFavoriteCreditCardVendors = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { limit = 10, page = 1 } = query;
    const limitNum = Number(limit);
    const pageNum = Number(page);
    const skip = (pageNum - 1) * limitNum;
    const user = yield user_model_1.User.findById(userId)
        .populate({
        path: 'favoriteCreditCardVendors',
        select: 'name logo website description', // Fields to select from the vendor
        options: {
            skip,
            limit: limitNum,
        },
    })
        .select('favoriteCreditCardVendors');
    if (!user) {
        throw new Error('User not found');
    }
    const total = ((_a = user.favoriteCreditCardVendors) === null || _a === void 0 ? void 0 : _a.length) || 0;
    return (0, returnWithMeta_1.returnWithMeta)({ total, limit: limitNum, page: pageNum }, user.favoriteCreditCardVendors);
});
exports.UserServices = {
    createUserIntoDB,
    getAllUsersFromDB,
    getMe,
    updateUserRoleIntoDB,
    deleteUserIntoDB,
    subscribeUser,
    subscribeToNewsletter,
    unsubscribeFromNewsletter,
    addFavoriteCompany,
    addFavoriteCreditCardVendor,
    removeFavoriteCompany,
    removeFavoriteCreditCardVendor,
    getAllFavoriteCompanies,
    getAllFavoriteCreditCardVendors,
};

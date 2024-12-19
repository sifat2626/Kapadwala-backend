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
const createUserIntoDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.create(userData);
    return user;
});
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, page = 1 } = query;
    const limitNum = Number(limit);
    const pageNum = Number(page);
    const skip = (pageNum - 1) * limitNum;
    const result = yield user_model_1.User.find().limit(limitNum).skip(skip);
    const total = yield user_model_1.User.countDocuments();
    const totalPage = Math.ceil(total / limitNum);
    return {
        meta: {
            total,
            limit: limitNum,
            page: pageNum,
            totalPage, // Add totalPage here
        },
        result,
    };
});
const getMe = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    return user;
});
const updateUserRoleIntoDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, data, { new: true });
    return updatedUser;
});
const deleteUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedUser = yield user_model_1.User.findByIdAndDelete(id);
    return deletedUser;
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
const addFavoriteCompany = (userId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield company_model_1.Company.findById(companyId);
    if (!company)
        throw new Error('Company not found');
    const user = yield user_model_1.User.findByIdAndUpdate(userId, { $addToSet: { favorites: companyId } }, // Prevent duplicates
    { new: true }).populate('favorites', 'name'); // Populate favorite companies
    return user;
});
const removeFavoriteCompany = (userId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(userId, { $pull: { favorites: companyId } }, // Remove the company ID
    { new: true }).populate('favorites', 'name');
    return user;
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
        options: {
            skip,
            limit: limitNum,
        },
    })
        .select('favorites');
    if (!user) {
        throw new Error('User not found');
    }
    const total = ((_a = user.favorites) === null || _a === void 0 ? void 0 : _a.length) || 0;
    return (0, returnWithMeta_1.returnWithMeta)({ total, limit: limitNum, page: pageNum }, user.favorites);
});
exports.UserServices = {
    createUserIntoDB,
    getAllUsersFromDB,
    getMe,
    updateUserRoleIntoDB,
    deleteUserIntoDB,
    subscribeUser,
    addFavoriteCompany,
    removeFavoriteCompany,
    getAllFavoriteCompanies,
};

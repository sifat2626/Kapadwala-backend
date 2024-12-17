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
const createUserIntoDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.create(userData);
    return user;
});
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, page = 1 } = query;
    const skip = (page - 1) * limit;
    const result = yield user_model_1.User.find().limit(limit).skip(skip);
    const total = yield user_model_1.User.countDocuments();
    return {
        meta: {
            total,
            limit,
            page,
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
    // Check if the company exists
    const company = yield company_model_1.Company.findById(companyId);
    if (!company)
        throw new Error('Company not found');
    // Add the company to the user's favorites if not already added
    const user = yield user_model_1.User.findByIdAndUpdate(userId, { $addToSet: { favorites: companyId } }, // Prevent duplicates
    { new: true }).populate('favorites', 'name'); // Populate favorite companies
    return user;
});
const removeFavoriteCompany = (userId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    // Remove the company from the user's favorites
    const user = yield user_model_1.User.findByIdAndUpdate(userId, { $pull: { favorites: companyId } }, // Remove the company ID
    { new: true }).populate('favorites', 'name');
    return user;
});
const getAllFavoriteCompanies = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the user and populate their favorite companies
    const user = yield user_model_1.User.findById(userId)
        .populate('favorites', 'name description logo website') // Populate company details
        .select('favorites'); // Return only the favorites field
    if (!user) {
        throw new Error('User not found');
    }
    return user;
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
    getAllFavoriteCompanies
};

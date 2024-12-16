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
exports.UserServices = {
    createUserIntoDB,
    getAllUsersFromDB,
    getMe,
    updateUserRoleIntoDB,
    deleteUserIntoDB,
    subscribeUser,
};

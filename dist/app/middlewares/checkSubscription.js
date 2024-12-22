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
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const user_model_1 = require("../modules/User/user.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const checkSubscription = () => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Assuming the user ID is stored in req.user after token validation
        if (!userId) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        // Fetch the user from the database
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
        }
        // Check if the subscription has expired
        const currentDate = new Date();
        if (user.expiresAt && currentDate > user.expiresAt) {
            // Update the user's subscription status if expired
            user.isSubscribed = false;
            yield user.save();
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Your subscription has expired. Please renew to access this resource!');
        }
        // Allow access if the subscription is not expired
        if (user.expiresAt && currentDate <= user.expiresAt) {
            return next(); // Grant access if still within the subscription period
        }
        // If no valid expiration date exists, block access
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You must be subscribed to access this resource!');
    }));
};
exports.default = checkSubscription;

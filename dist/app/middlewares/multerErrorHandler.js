"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        // Multer-specific errors
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    else if (err) {
        // Generic errors
        return res.status(400).json({
            success: false,
            message: err.message || 'An unknown error occurred',
        });
    }
    next();
};
exports.default = multerErrorHandler;

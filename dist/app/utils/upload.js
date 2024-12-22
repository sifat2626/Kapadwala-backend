"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Configure in-memory storage
const storage = multer_1.default.memoryStorage();
console.log('in middleware');
// File filter to validate CSV files
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
        cb(null, true); // Accept file
    }
    else {
        cb(new Error('Only CSV files are allowed'), false); // Reject file
    }
};
// Set upload limits (optional)
const limits = {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
};
// Configure multer
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits,
});
exports.upload = upload;

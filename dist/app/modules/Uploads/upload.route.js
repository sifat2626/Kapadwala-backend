"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvTestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
// Configure multer for in-memory storage
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }); // In-memory upload
router.post('/upload-csv/test', upload.single('file'), // Ensure 'file' matches Postman's key
(req, res) => {
    try {
        console.log('req.file:', req.file);
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log('Uploaded file details:', req.file);
        res.status(200).json({ message: 'File uploaded successfully', file: req.file });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'File upload failed', error: error.message });
    }
});
exports.CsvTestRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const deal_controller_1 = require("./deal.controller");
const router = express_1.default.Router();
// Configure multer for file uploads
const upload = (0, multer_1.default)({ dest: 'uploads/' }); // Files will be stored in 'uploads/' temporarily
// Route for uploading a CSV to create/update deals
router.post('/upload-csv', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), // Only admins can upload CSV files
upload.single('file'), // Accepts a single file with the key 'file'
deal_controller_1.DealControllers.uploadDealsFromCSV);
// Get all deals
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.user), // Authenticated users can access deals
deal_controller_1.DealControllers.getAllDeals);
// Get top deals
router.get('/top', (0, auth_1.default)(user_constant_1.USER_ROLE.user), // Authenticated users can access top deals
deal_controller_1.DealControllers.getTopDeals);
exports.DealRoutes = router;

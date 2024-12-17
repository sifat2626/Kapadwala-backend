"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const deal_controller_1 = require("./deal.controller");
const upload_1 = require("../../utils/upload");
const router = express_1.default.Router();
// Route for uploading a CSV to create/update deals
router.post('/upload-csv', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), // Only admins can upload CSV files
upload_1.upload.single('file'), // Accepts a single file with the key 'file'
deal_controller_1.DealControllers.uploadDealsFromCSV);
router.get('/active', deal_controller_1.DealControllers.getAllActiveDeals);
router.get('/cashback-rate/:companyName', deal_controller_1.DealControllers.getBestCashbackRateByCompany);
router.get('/giftcard-rate/:companyName', deal_controller_1.DealControllers.getBestGiftcardRateByCompany);
router.get('/creditcard/expiring-soon/:vendorName', deal_controller_1.DealControllers.getExpiringCreditcardDealsByVendor);
router.get('/giftcard/active', deal_controller_1.DealControllers.getActiveGiftcardDeals);
router.get('/cashback/active', deal_controller_1.DealControllers.getActiveCashbackDeals);
router.get('/creditcard/active', deal_controller_1.DealControllers.getActiveCreditcardDeals);
// Get all deals
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), // Authenticated users can access deals
deal_controller_1.DealControllers.getAllDeals);
// Get top deals
router.get('/top', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), // Authenticated users can access top deals
deal_controller_1.DealControllers.getTopDeals);
exports.DealRoutes = router;

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
const protect_1 = __importDefault(require("../../middlewares/protect"));
const router = express_1.default.Router();
// Route for uploading a CSV to create/update deals
router.post('/upload-csv', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), // Only admins can upload CSV files
upload_1.upload.single('file'), // Accepts a single file with the key 'file'
deal_controller_1.DealControllers.uploadDealsFromCSV);
router.get('/active', (0, protect_1.default)(), deal_controller_1.DealControllers.getAllActiveDeals);
router.get('/cashback-rate/:companyName', (0, protect_1.default)(), deal_controller_1.DealControllers.getBestCashbackRateByCompany);
router.get('/giftcard-rate/:companyName', (0, protect_1.default)(), deal_controller_1.DealControllers.getBestGiftcardRateByCompany);
router.get('/creditcard/expiring-soon/:vendorName', (0, protect_1.default)(), deal_controller_1.DealControllers.getExpiringCreditcardDealsByVendor);
router.get('/giftcard/active', (0, protect_1.default)(), deal_controller_1.DealControllers.getActiveGiftcardDeals);
router.get('/cashback/active', (0, protect_1.default)(), deal_controller_1.DealControllers.getActiveCashbackDeals);
router.get('/creditcard/active', (0, protect_1.default)(), deal_controller_1.DealControllers.getActiveCreditcardDeals);
// Get all deals
router.get('/', (0, protect_1.default)(), deal_controller_1.DealControllers.getAllDeals);
// Get top deals
router.get('/top', (0, protect_1.default)(), deal_controller_1.DealControllers.getTopDeals);
exports.DealRoutes = router;

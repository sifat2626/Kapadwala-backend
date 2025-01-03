"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoutes = void 0;
const express_1 = require("express");
const vendor_controller_1 = require("./vendor.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const vendor_validation_1 = require("./vendor.validation");
const user_constant_1 = require("../User/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const protect_1 = __importDefault(require("../../middlewares/protect"));
const upload_1 = require("../../utils/upload");
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_1.default)(vendor_validation_1.VendorValidation.createVendor), (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), vendor_controller_1.VendorController.createVendor);
router.post('/upload-csv', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), upload_1.upload.single('file'), // Handle single file upload with the key 'file'
vendor_controller_1.VendorController.uploadVendorsFromCSV);
router.get('/', (0, protect_1.default)(), vendor_controller_1.VendorController.getAllVendors);
router.get('/:id', (0, protect_1.default)(), vendor_controller_1.VendorController.getVendorById);
router.get('/deals/:vendorName', (0, protect_1.default)(), vendor_controller_1.VendorController.getDealsByVendorName);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(vendor_validation_1.VendorValidation.updateVendor), vendor_controller_1.VendorController.updateVendor);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), vendor_controller_1.VendorController.deleteVendor);
exports.VendorRoutes = router;

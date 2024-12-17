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
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_1.default)(vendor_validation_1.VendorValidation.createVendor), (0, auth_1.default)(user_constant_1.USER_ROLE.admin), vendor_controller_1.VendorController.createVendor);
router.get('/', vendor_controller_1.VendorController.getAllVendors);
router.get('/:id', vendor_controller_1.VendorController.getVendorById);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(vendor_validation_1.VendorValidation.updateVendor), vendor_controller_1.VendorController.updateVendor);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), vendor_controller_1.VendorController.deleteVendor);
exports.VendorRoutes = router;

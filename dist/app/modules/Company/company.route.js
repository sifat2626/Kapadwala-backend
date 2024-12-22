"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRoutes = void 0;
const express_1 = require("express");
const company_controller_1 = require("./company.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const company_validation_1 = require("./company.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const protect_1 = __importDefault(require("../../middlewares/protect"));
const user_constant_1 = require("../User/user.constant");
const upload_1 = require("../../utils/upload");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(company_validation_1.CompanyValidation.createCompany), company_controller_1.CompanyController.createCompany);
router.post('/upload-csv', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), // Only admins can upload CSV files
upload_1.upload.single('file'), // Accepts a single file with the key 'file'
company_controller_1.CompanyController.uploadCompaniesFromCSV);
router.get('/', (0, protect_1.default)(), company_controller_1.CompanyController.getAllCompanies);
router.get('/:id', (0, protect_1.default)(), company_controller_1.CompanyController.getCompanyById);
router.get('/deals/:companyName/', (0, protect_1.default)(), company_controller_1.CompanyController.getDealsByCompanyName);
router.get('/active-deals/:companyName', (0, protect_1.default)(), company_controller_1.CompanyController.getActiveDealsByCompany);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(company_validation_1.CompanyValidation.updateCompany), company_controller_1.CompanyController.updateCompany);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), company_controller_1.CompanyController.deleteCompany);
exports.CompanyRoutes = router;

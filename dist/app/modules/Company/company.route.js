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
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_1.default)(company_validation_1.CompanyValidation.createCompany), company_controller_1.CompanyController.createCompany);
router.get('/', company_controller_1.CompanyController.getAllCompanies);
router.get('/:id', company_controller_1.CompanyController.getCompanyById);
router.get('/deals/:companyName', company_controller_1.CompanyController.getDealsByCompanyName);
router.get('/active-deals/:companyName', company_controller_1.CompanyController.getActiveDealsByCompany);
router.patch('/:id', (0, validateRequest_1.default)(company_validation_1.CompanyValidation.updateCompany), company_controller_1.CompanyController.updateCompany);
router.delete('/:id', company_controller_1.CompanyController.deleteCompany);
exports.CompanyRoutes = router;

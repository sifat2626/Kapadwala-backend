"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const company_service_1 = require("./company.service");
const createCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield company_service_1.CompanyService.createCompany(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Company created successfully.',
        data: company,
    });
}));
const getAllCompanies = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companies = yield company_service_1.CompanyService.getAllCompanies(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Companies retrieved successfully.',
        meta: companies.meta, // Include meta information
        data: companies.data, // Companies data
    });
}));
const getCompanyById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield company_service_1.CompanyService.getCompanyById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Company retrieved successfully.',
        data: company,
    });
}));
const getDealsByCompanyName = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName } = req.params;
    const deals = yield company_service_1.CompanyService.getDealsByCompanyName(companyName, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Deals for company '${companyName}' retrieved successfully.`,
        meta: deals.meta, // Include meta information
        data: deals.data, // Deals data
    });
}));
const getActiveDealsByCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName } = req.params;
    const { type } = req.query; // Optional type filter
    const deals = yield company_service_1.CompanyService.getActiveDealsByCompany(companyName, type, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Active deals for company '${companyName}'${type ? ` of type '${type}'` : ''} retrieved successfully.`,
        meta: deals.meta, // Include meta information
        data: deals.data, // Deals data
    });
}));
const updateCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield company_service_1.CompanyService.updateCompany(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Company updated successfully.',
        data: company,
    });
}));
const deleteCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield company_service_1.CompanyService.deleteCompany(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.NO_CONTENT,
        success: true,
        message: 'Company deleted successfully.',
        data: '',
    });
}));
const uploadCompaniesFromCSV = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new Error('No file uploaded.');
    }
    // Parse the CSV file
    const buffer = req.file.buffer;
    const companies = yield company_service_1.CompanyService.uploadCompaniesFromCSV(buffer);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Companies uploaded successfully.',
        data: companies, // Return the created/updated companies
    });
}));
exports.CompanyController = {
    createCompany,
    uploadCompaniesFromCSV,
    getAllCompanies,
    getCompanyById,
    getDealsByCompanyName,
    getActiveDealsByCompany,
    updateCompany,
    deleteCompany,
};

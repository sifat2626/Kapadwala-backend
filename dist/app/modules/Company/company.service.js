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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const company_model_1 = require("./company.model");
const deals_model_1 = require("../Deals/deals.model");
const createCompany = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield company_model_1.Company.create(data);
    return company;
});
const getAllCompanies = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const companies = yield company_model_1.Company.find()
        .skip(skip)
        .limit(Number(limit));
    const total = yield company_model_1.Company.countDocuments();
    return { companies, total };
});
const getCompanyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield company_model_1.Company.findById(id);
    if (!company)
        throw new Error('Company not found');
    return company;
});
const updateCompany = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield company_model_1.Company.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!company)
        throw new Error('Company not found');
    return company;
});
const deleteCompany = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete all related deals first
    yield deals_model_1.Deal.deleteMany({ companyId: id });
    // Find and delete the company
    const company = yield company_model_1.Company.findByIdAndDelete(id);
    if (!company)
        throw new Error('Company not found');
});
exports.CompanyService = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
};

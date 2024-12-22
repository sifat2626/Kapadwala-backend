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
    const skip = (page - 1) * Number(limit);
    const companies = yield company_model_1.Company.find()
        .skip(skip)
        .limit(Number(limit));
    const total = yield company_model_1.Company.countDocuments();
    return {
        meta: {
            total,
            limit: Number(limit),
            page: Number(page),
            totalPage: Math.ceil(total / Number(limit)),
        },
        data: companies,
    };
});
const getCompanyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield company_model_1.Company.findById(id);
    if (!company)
        throw new Error('Company not found');
    return company;
});
const getDealsByCompanyName = (companyName, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, type = null } = query;
    const skip = (page - 1) * Number(limit);
    // Find the company by name
    const company = yield company_model_1.Company.findOne({ name: { $regex: companyName, $options: 'i' } });
    if (!company)
        throw new Error('Company not found');
    const currentDate = new Date();
    // Fetch all non-expired deals related to this company with pagination
    const queryObj = {
        companyId: company._id,
        expiryDate: { $gte: currentDate },
    };
    // Add 'type' to the query if it is provided
    if (type) {
        queryObj.type = type;
    }
    // Fetch all non-expired deals related to this company with pagination
    const deals = yield deals_model_1.Deal.find(queryObj)
        .sort({ percentage: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('vendorId', 'name logo website')
        .populate('companyId', 'name');
    const total = yield deals_model_1.Deal.countDocuments(queryObj);
    return {
        meta: {
            total,
            limit: Number(limit),
            page: Number(page),
            totalPage: Math.ceil(total / Number(limit)),
        },
        data: deals,
    };
});
const getActiveDealsByCompany = (companyName_1, type_1, ...args_1) => __awaiter(void 0, [companyName_1, type_1, ...args_1], void 0, function* (companyName, type, query = {}) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * Number(limit);
    // Find the company by name
    const company = yield company_model_1.Company.findOne({ name: companyName });
    if (!company)
        throw new Error('Company not found');
    const currentDate = new Date();
    // Define the base query
    const filters = {
        companyId: company._id,
        isActive: true,
        expiryDate: { $gte: currentDate },
    };
    if (type) {
        filters.type = type;
    }
    const deals = yield deals_model_1.Deal.find(filters)
        .skip(skip)
        .limit(Number(limit))
        .sort({ percentage: -1 })
        .populate('vendorId', 'name logo website')
        .populate('companyId', 'name');
    const total = yield deals_model_1.Deal.countDocuments(filters);
    return {
        meta: {
            total,
            limit: Number(limit),
            page: Number(page),
            totalPage: Math.ceil(total / Number(limit)),
        },
        data: deals,
    };
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
    getDealsByCompanyName,
    getActiveDealsByCompany,
    updateCompany,
    deleteCompany,
};

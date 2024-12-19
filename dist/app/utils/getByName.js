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
exports.getCompanyIdByName = exports.getVendorIdByName = void 0;
// Helper: Get Vendor ID by Name
const vendor_model_1 = require("../modules/Vendor/vendor.model");
const company_model_1 = require("../modules/Company/company.model");
const getVendorIdByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_model_1.Vendor.findOne({ name });
    return vendor ? vendor._id : null;
});
exports.getVendorIdByName = getVendorIdByName;
// Helper: Get Company ID by Name
const getCompanyIdByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield company_model_1.Company.findOne({ name });
    return company ? company._id : null;
});
exports.getCompanyIdByName = getCompanyIdByName;

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
exports.VendorService = void 0;
const vendor_model_1 = require("./vendor.model");
const deals_model_1 = require("../Deals/deals.model");
const createVendor = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_model_1.Vendor.create(data);
    return vendor;
});
const getAllVendors = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const vendors = yield vendor_model_1.Vendor.find()
        .skip(skip)
        .limit(Number(limit));
    const total = yield vendor_model_1.Vendor.countDocuments();
    return { vendors, total };
});
const getVendorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_model_1.Vendor.findById(id);
    if (!vendor)
        throw new Error('Vendor not found');
    return vendor;
});
const updateVendor = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_model_1.Vendor.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!vendor)
        throw new Error('Vendor not found');
    return vendor;
});
const deleteVendor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Find and delete the vendor
    const vendor = yield vendor_model_1.Vendor.findByIdAndDelete(id);
    if (!vendor)
        throw new Error('Vendor not found');
    // Delete all related deals where vendorId matches
    yield deals_model_1.Deal.deleteMany({ vendorId: id });
});
exports.VendorService = {
    createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
};

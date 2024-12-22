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
exports.VendorService = void 0;
const vendor_model_1 = require("./vendor.model");
const deals_model_1 = require("../Deals/deals.model");
const stream_1 = require("stream");
const csv_parser_1 = __importDefault(require("csv-parser"));
const createVendor = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_model_1.Vendor.create(data);
    return vendor;
});
const uploadVendorsFromCSV = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = [];
    // Parse the CSV buffer
    yield new Promise((resolve, reject) => {
        const stream = stream_1.Readable.from(buffer);
        stream
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            vendors.push({
                name: row.name,
                logo: row.logo || '', // Optional field
                website: row.website || '', // Optional field
            });
        })
            .on('end', resolve)
            .on('error', reject);
    });
    const results = {
        createdVendors: 0,
        updatedVendors: 0,
    };
    // Iterate over the parsed vendors and add/update them in the database
    for (const vendor of vendors) {
        const existingVendor = yield vendor_model_1.Vendor.findOne({ name: vendor.name });
        if (existingVendor) {
            // Update the existing vendor
            existingVendor.logo = vendor.logo || existingVendor.logo;
            existingVendor.website = vendor.website || existingVendor.website;
            yield existingVendor.save();
            results.updatedVendors++;
        }
        else {
            // Create a new vendor
            yield vendor_model_1.Vendor.create(vendor);
            results.createdVendors++;
        }
    }
    return results;
});
const getAllVendors = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const vendors = yield vendor_model_1.Vendor.find()
        .skip(skip)
        .limit(Number(limit));
    const total = yield vendor_model_1.Vendor.countDocuments();
    const totalPage = Math.ceil(total / Number(limit)); // Calculate total pages
    return {
        meta: {
            total,
            limit: Number(limit),
            page: Number(page),
            totalPage, // Include totalPage in the meta
        },
        data: vendors,
    };
});
const getVendorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_model_1.Vendor.findById(id);
    if (!vendor)
        throw new Error('Vendor not found');
    return vendor;
});
const getDealsByVendorName = (vendorName, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * Number(limit);
    // Find the vendor by name
    const vendor = yield vendor_model_1.Vendor.findOne({ name: vendorName });
    if (!vendor)
        throw new Error('Vendor not found');
    const currentDate = new Date();
    // Fetch all non-expired deals related to this vendor with pagination
    const deals = yield deals_model_1.Deal.find({
        vendorId: vendor._id,
        expiryDate: { $gte: currentDate }, // Filter only active (non-expired) deals
    })
        .skip(skip)
        .limit(Number(limit))
        .populate('vendorId', 'name logo website') // Populate vendor details
        .populate('companyId', 'name'); // Populate company name for reference
    const total = yield deals_model_1.Deal.countDocuments({
        vendorId: vendor._id,
        expiryDate: { $gte: currentDate },
    });
    const totalPage = Math.ceil(total / Number(limit)); // Calculate total pages
    return {
        meta: {
            total,
            limit: Number(limit),
            page: Number(page),
            totalPage,
        },
        data: deals,
    };
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
    uploadVendorsFromCSV,
    getAllVendors,
    getVendorById,
    getDealsByVendorName,
    updateVendor,
    deleteVendor,
};

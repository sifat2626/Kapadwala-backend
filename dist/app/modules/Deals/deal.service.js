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
exports.DealServices = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const deals_model_1 = require("./deals.model");
const company_model_1 = require("../Company/company.model");
const vendor_model_1 = require("../Vendor/vendor.model");
// Process CSV Data
const processCSVData = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    const deals = [];
    // Parse CSV data from the buffer
    yield new Promise((resolve, reject) => {
        const bufferStream = new stream_1.PassThrough();
        bufferStream.end(buffer);
        bufferStream
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => deals.push(row))
            .on('end', resolve)
            .on('error', reject);
    });
    const results = {
        createdDeals: 0,
        updatedDeals: 0,
        newCompanies: 0,
        newVendors: 0,
    };
    // Resolve or create companies and vendors in batches for efficiency
    const companyMap = new Map();
    const vendorMap = new Map();
    // Populate existing companies and vendors
    const existingCompanies = yield company_model_1.Company.find();
    const existingVendors = yield vendor_model_1.Vendor.find();
    existingCompanies.forEach((company) => companyMap.set(company.name, company._id));
    existingVendors.forEach((vendor) => vendorMap.set(vendor.name, vendor._id));
    for (const deal of deals) {
        const { title, percentage, type, vendorName, companyName, expiryDate, link } = deal;
        // Validate required fields
        if (!title || !percentage || !type || !vendorName || !companyName || !expiryDate || !link) {
            console.error(`Invalid deal entry, skipping: ${JSON.stringify(deal)}`);
            continue;
        }
        // Resolve or create the company
        let companyId = companyMap.get(companyName);
        if (!companyId) {
            const newCompany = yield company_model_1.Company.create({
                name: companyName,
                description: `${companyName} auto-created from CSV`,
                logo: '',
                website: '',
            });
            companyId = newCompany._id;
            companyMap.set(companyName, companyId);
            results.newCompanies++;
        }
        // Resolve or create the vendor
        let vendorId = vendorMap.get(vendorName);
        if (!vendorId) {
            const newVendor = yield vendor_model_1.Vendor.create({
                name: vendorName,
                logo: '',
                website: '',
            });
            vendorId = newVendor._id;
            vendorMap.set(vendorName, vendorId);
            results.newVendors++;
        }
        // Check if the deal already exists
        const existingDeal = yield deals_model_1.Deal.findOne({
            title,
            vendorId,
            companyId,
        });
        if (existingDeal) {
            existingDeal.percentage = percentage;
            // existingDeal.type = type;
            existingDeal.expiryDate = new Date(expiryDate);
            existingDeal.link = link;
            existingDeal.isActive = new Date(expiryDate) > new Date();
            yield existingDeal.save();
            results.updatedDeals++;
        }
        else {
            yield deals_model_1.Deal.create({
                title,
                percentage,
                type,
                vendorId,
                companyId,
                expiryDate: new Date(expiryDate),
                link,
                isActive: new Date(expiryDate) > new Date(),
            });
            results.createdDeals++;
        }
    }
    return `Processed ${deals.length} deals.\nDetails: ${JSON.stringify(results)}`;
});
// Fetch All Deals
const getAllDeals = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, vendorName, companyName, page = 1, limit = 10 } = query;
    // Build filters dynamically
    const filters = {};
    if (type)
        filters.type = type;
    if (vendorName)
        filters.vendorId = yield getVendorIdByName(vendorName);
    if (companyName)
        filters.companyId = yield getCompanyIdByName(companyName);
    // Pagination setup
    const skip = (page - 1) * limit;
    const deals = yield deals_model_1.Deal.find(filters)
        .skip(skip)
        .limit(limit)
        .populate('vendorId')
        .populate('companyId');
    const total = yield deals_model_1.Deal.countDocuments(filters);
    return {
        meta: {
            total,
            limit,
            page,
        },
        data: deals,
    };
});
// Fetch Top Deals
const getTopDeals = () => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Find the best cashback deals
    const cashbackDeals = yield deals_model_1.Deal.aggregate([
        { $match: { type: 'cashback', isActive: true } }, // Only active cashback deals
        { $sort: { percentage: -1 } }, // Sort by highest percentage
        {
            $group: {
                _id: '$companyId', // Group by company
                bestCashbackDeal: { $first: '$$ROOT' }, // Pick the best cashback deal for each company
            },
        },
    ]);
    // Step 2: Find the best gift card deals
    const giftcardDeals = yield deals_model_1.Deal.aggregate([
        { $match: { type: 'giftcard', isActive: true } }, // Only active gift card deals
        { $sort: { percentage: -1 } }, // Sort by highest percentage
        {
            $group: {
                _id: '$companyId', // Group by company
                bestGiftcardDeal: { $first: '$$ROOT' }, // Pick the best gift card deal for each company
            },
        },
    ]);
    // Step 3: Find Amex and Chase deals
    const creditCardDeals = yield deals_model_1.Deal.aggregate([
        {
            $match: {
                type: 'creditcard',
                isActive: true,
                companyId: { $in: ['AmexID', 'ChaseID'] }, // Replace with actual Amex and Chase IDs
            },
        },
        { $sort: { percentage: -1 } }, // Sort by highest percentage
    ]);
    // Step 4: Combine all the information by company
    const topDealsByCompany = [];
    const cashbackMap = new Map();
    const giftcardMap = new Map();
    cashbackDeals.forEach((deal) => cashbackMap.set(deal._id.toString(), deal.bestCashbackDeal));
    giftcardDeals.forEach((deal) => giftcardMap.set(deal._id.toString(), deal.bestGiftcardDeal));
    const companyIds = [...new Set([...cashbackMap.keys(), ...giftcardMap.keys()])];
    const companies = yield company_model_1.Company.find({ _id: { $in: companyIds } });
    for (const company of companies) {
        const companyId = company._id.toString();
        const bestCashbackDeal = cashbackMap.get(companyId);
        const bestGiftcardDeal = giftcardMap.get(companyId);
        // Filter credit card deals for this company
        const relevantCreditCardDeals = creditCardDeals.filter((deal) => deal.companyId.toString() === companyId);
        // Determine the top rate for sorting
        const bestRate = Math.max((bestCashbackDeal === null || bestCashbackDeal === void 0 ? void 0 : bestCashbackDeal.percentage) || 0, (bestGiftcardDeal === null || bestGiftcardDeal === void 0 ? void 0 : bestGiftcardDeal.percentage) || 0);
        topDealsByCompany.push({
            company: {
                id: companyId,
                name: company.name,
            },
            bestRate, // Use this for sorting
            bestCashbackDeal: bestCashbackDeal
                ? {
                    vendor: yield vendor_model_1.Vendor.findById(bestCashbackDeal.vendorId),
                    percentage: bestCashbackDeal.percentage,
                    link: bestCashbackDeal.link,
                }
                : null,
            bestGiftcardDeal: bestGiftcardDeal
                ? {
                    vendor: yield vendor_model_1.Vendor.findById(bestGiftcardDeal.vendorId),
                    percentage: bestGiftcardDeal.percentage,
                    link: bestGiftcardDeal.link,
                }
                : null,
            creditCardDeals: relevantCreditCardDeals.map((deal) => ({
                type: deal.type,
                percentage: deal.percentage,
                link: deal.link,
            })),
        });
    }
    // Step 5: Sort companies by the best rate in descending order
    return topDealsByCompany.sort((a, b) => b.bestRate - a.bestRate);
});
// Helper: Get Vendor ID by Name
const getVendorIdByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_model_1.Vendor.findOne({ name });
    return vendor ? vendor._id : null;
});
// Helper: Get Company ID by Name
const getCompanyIdByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield company_model_1.Company.findOne({ name });
    return company ? company._id : null;
});
exports.DealServices = {
    getAllDeals,
    getTopDeals,
    processCSVData,
};

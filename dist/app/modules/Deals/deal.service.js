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
    const companyMap = new Map();
    const vendorMap = new Map();
    const existingCompanies = yield company_model_1.Company.find();
    const existingVendors = yield vendor_model_1.Vendor.find();
    existingCompanies.forEach((company) => companyMap.set(company.name, company._id));
    existingVendors.forEach((vendor) => vendorMap.set(vendor.name, vendor._id));
    for (const deal of deals) {
        const { title, percentage, type, vendorName, companyName, expiryDate, link } = deal;
        if (!title || !percentage || !type || !vendorName || !companyName || !expiryDate || !link) {
            console.error(`Invalid deal entry, skipping: ${JSON.stringify(deal)}`);
            continue;
        }
        let companyId = companyMap.get(companyName);
        if (!companyId) {
            const newCompany = yield company_model_1.Company.create({ name: companyName, logo: '', website: '' });
            companyId = newCompany._id;
            companyMap.set(companyName, companyId);
            results.newCompanies++;
        }
        let vendorId = vendorMap.get(vendorName);
        if (!vendorId) {
            const newVendor = yield vendor_model_1.Vendor.create({ name: vendorName, logo: '', website: '' });
            vendorId = newVendor._id;
            vendorMap.set(vendorName, vendorId);
            results.newVendors++;
        }
        const existingDeal = yield deals_model_1.Deal.findOne({ title, vendorId, companyId });
        if (existingDeal) {
            existingDeal.percentage = percentage;
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
    const filters = {};
    if (type)
        filters.type = type;
    if (vendorName) {
        const vendorId = yield getVendorIdByName(vendorName);
        if (vendorId)
            filters.vendorId = vendorId;
    }
    if (companyName) {
        const companyId = yield getCompanyIdByName(companyName);
        if (companyId)
            filters.companyId = companyId;
    }
    const skip = (page - 1) * limit;
    const deals = yield deals_model_1.Deal.find(filters)
        .skip(skip)
        .limit(limit)
        .populate('vendorId', 'name logo website') // Populate vendor details
        .populate('companyId', 'name'); // Populate company name
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
const getAllActiveDeals = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    // Fetch all non-expired deals
    const activeDeals = yield deals_model_1.Deal.find({
        expiryDate: { $gte: currentDate }, // Only non-expired deals
    })
        .populate('vendorId', 'name logo website') // Populate vendor details
        .populate('companyId', 'name'); // Populate company details
    return activeDeals;
});
// Fetch Top Deals
const getTopDeals = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    // Fetch the best non-expired cashback deals
    const cashbackDeals = yield deals_model_1.Deal.aggregate([
        { $match: { type: 'cashback', isActive: true, expiryDate: { $gte: currentDate } } },
        { $sort: { percentage: -1 } },
        { $group: { _id: '$companyId', bestCashbackDeal: { $first: '$$ROOT' } } },
    ]);
    // Fetch the best non-expired gift card deals
    const giftcardDeals = yield deals_model_1.Deal.aggregate([
        { $match: { type: 'giftcard', isActive: true, expiryDate: { $gte: currentDate } } },
        { $sort: { percentage: -1 } },
        { $group: { _id: '$companyId', bestGiftcardDeal: { $first: '$$ROOT' } } },
    ]);
    // Fetch the best non-expired credit card deals
    const creditCardDeals = yield deals_model_1.Deal.find({
        type: 'creditcard',
        isActive: true,
        expiryDate: { $gte: currentDate }, // Only fetch non-expired deals
    })
        .sort({ percentage: -1 })
        .populate('vendorId', 'name logo website'); // Populate vendor details
    // Maps for efficient grouping
    const cashbackMap = new Map();
    const giftcardMap = new Map();
    const creditCardMap = new Map();
    // Fill cashback and gift card maps
    cashbackDeals.forEach((deal) => cashbackMap.set(deal._id.toString(), deal.bestCashbackDeal));
    giftcardDeals.forEach((deal) => giftcardMap.set(deal._id.toString(), deal.bestGiftcardDeal));
    // Group credit card deals by companyId
    creditCardDeals.forEach((deal) => {
        const companyId = deal.companyId.toString();
        if (!creditCardMap.has(companyId))
            creditCardMap.set(companyId, []);
        creditCardMap.get(companyId).push({
            vendor: deal.vendorId, // Populated vendor details
            percentage: deal.percentage,
            link: deal.link,
        });
    });
    // Fetch all company details for unique companyIds
    const companyIds = [...new Set([...cashbackMap.keys(), ...giftcardMap.keys(), ...creditCardMap.keys()])];
    const companies = yield company_model_1.Company.find({ _id: { $in: companyIds } });
    // Combine results
    return companies.map((company) => {
        const companyId = company._id.toString();
        return {
            company: { id: companyId, name: company.name },
            bestCashbackDeal: cashbackMap.get(companyId) || null,
            bestGiftcardDeal: giftcardMap.get(companyId) || null,
            creditCardDeals: creditCardMap.get(companyId) || [],
        };
    });
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
const getBestCashbackRateByCompany = (companyName) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all cashback deals for the given company (active and expired)
    const deals = yield deals_model_1.Deal.aggregate([
        {
            $match: {
                type: 'cashback',
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'companyId',
                foreignField: '_id',
                as: 'company',
            },
        },
        { $unwind: '$company' }, // Flatten company array
        { $match: { 'company.name': companyName } }, // Filter by company name
        {
            $group: {
                _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } },
                bestCashbackRate: { $max: '$percentage' }, // Get the max cashback rate for each date
            },
        },
        { $sort: { '_id.date': 1 } }, // Sort by date ascending
    ]);
    // Format the results
    return deals.map((deal) => ({
        date: deal._id.date,
        cashbackRate: deal.bestCashbackRate,
    }));
});
const getBestGiftcardRateByCompany = (companyName) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all gift card deals for the given company
    const deals = yield deals_model_1.Deal.aggregate([
        {
            $match: {
                type: 'giftcard', // Filter only gift card deals
            },
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'companyId',
                foreignField: '_id',
                as: 'company',
            },
        },
        { $unwind: '$company' }, // Flatten the company array
        { $match: { 'company.name': companyName } }, // Filter by company name
        {
            $group: {
                _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } },
                bestGiftcardRate: { $max: '$percentage' }, // Get the max gift card rate for each date
            },
        },
        { $sort: { '_id.date': 1 } }, // Sort by date in ascending order
    ]);
    // Format the result
    return deals.map((deal) => ({
        date: deal._id.date,
        giftcardRate: deal.bestGiftcardRate,
    }));
});
const getActiveCashbackDeals = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    // Fetch all active cashback deals, sorted by percentage in descending order
    const deals = yield deals_model_1.Deal.find({
        type: 'cashback', // Only cashback deals
        isActive: true, // Only active deals
        expiryDate: { $gte: currentDate }, // Deals that haven't expired
    })
        .sort({ percentage: -1 }) // Sort from best to worst
        .populate('vendorId', 'name logo website') // Populate vendor details
        .populate('companyId', 'name'); // Populate company details
    return deals;
});
const getActiveGiftcardDeals = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    // Fetch all active gift card deals, sorted by percentage in descending order
    const deals = yield deals_model_1.Deal.find({
        type: 'giftcard', // Only gift card deals
        isActive: true, // Only active deals
        expiryDate: { $gte: currentDate }, // Deals that haven't expired
    })
        .sort({ percentage: -1 }) // Sort from best to worst
        .populate('vendorId', 'name logo website') // Populate vendor details
        .populate('companyId', 'name'); // Populate company details
    return deals;
});
const getActiveCreditcardDeals = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    // Fetch all active credit card deals sorted by percentage in descending order
    const deals = yield deals_model_1.Deal.find({
        type: 'creditcard', // Only credit card deals
        isActive: true, // Only active deals
        expiryDate: { $gte: currentDate }, // Deals that haven't expired
    })
        .sort({ percentage: -1 }) // Sort by percentage (best to worst)
        .populate('vendorId', 'name logo website') // Populate vendor details
        .populate('companyId', 'name'); // Populate company details
    return deals;
});
exports.DealServices = {
    getAllDeals,
    getAllActiveDeals,
    getBestCashbackRateByCompany,
    getBestGiftcardRateByCompany,
    getActiveCashbackDeals,
    getActiveGiftcardDeals,
    getActiveCreditcardDeals,
    getTopDeals,
    processCSVData,
};

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
const getByName_1 = require("../../utils/getByName");
const returnWithMeta_1 = require("../../utils/returnWithMeta");
// Process CSV Data
const processCSVData = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    const deals = [];
    const invalidDeals = [];
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
        invalidExpiryDates: 0,
    };
    const companyMap = new Map();
    const vendorMap = new Map();
    const existingCompanies = yield company_model_1.Company.find();
    const existingVendors = yield vendor_model_1.Vendor.find();
    existingCompanies.forEach((company) => companyMap.set(company.name, company._id));
    existingVendors.forEach((vendor) => vendorMap.set(vendor.name, vendor._id));
    for (const deal of deals) {
        const { title, percentage = 0, type, vendorName, companyName, expiryDate, link, } = deal;
        // Validate mandatory fields
        if (!title ||
            !type ||
            !vendorName ||
            !companyName ||
            !expiryDate ||
            !link) {
            invalidDeals.push(deal);
            continue;
        }
        // Parse expiryDate to handle both `DD/MM/YYYY` and `YYYY-MM-DD` formats
        let parsedExpiryDate = null;
        if (expiryDate.includes('/')) {
            // Handle DD/MM/YYYY format
            const [day, month, year] = expiryDate.split('/');
            if (day && month && year) {
                parsedExpiryDate = new Date(`${year}-${month}-${day}`);
            }
        }
        else if (expiryDate.includes('-')) {
            // Handle YYYY-MM-DD format
            parsedExpiryDate = new Date(expiryDate);
        }
        // Check if expiryDate is valid
        if (!parsedExpiryDate || isNaN(parsedExpiryDate.getTime())) {
            console.error(`Invalid expiry date for deal: ${JSON.stringify(deal)}`);
            results.invalidExpiryDates++;
            invalidDeals.push(deal);
            continue;
        }
        let companyId = companyMap.get(companyName);
        if (!companyId) {
            const newCompany = yield company_model_1.Company.create({
                name: companyName,
                logo: '',
                website: '',
            });
            companyId = newCompany._id;
            companyMap.set(companyName, companyId);
            results.newCompanies++;
        }
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
        const existingDeal = yield deals_model_1.Deal.findOne({ title, vendorId, companyId });
        if (existingDeal) {
            existingDeal.percentage = percentage;
            existingDeal.expiryDate = parsedExpiryDate;
            existingDeal.link = link;
            existingDeal.isActive = parsedExpiryDate > new Date();
            yield existingDeal.save();
            results.updatedDeals++;
        }
        else {
            yield deals_model_1.Deal.create({
                title,
                percentage: type === 'creditcard' ? undefined : percentage, // Allow undefined for creditcard
                type,
                vendorId,
                companyId,
                expiryDate: parsedExpiryDate,
                link,
                isActive: parsedExpiryDate > new Date(),
            });
            results.createdDeals++;
        }
    }
    return `Processed ${deals.length} deals.\nDetails: ${JSON.stringify(results)}\nInvalid Deals: ${invalidDeals.length}`;
});
// Fetch All Deals
const getAllDeals = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, vendorName, companyName, page = 1, limit = 10 } = query;
    const filters = {};
    if (type)
        filters.type = type;
    if (vendorName) {
        const vendorId = yield (0, getByName_1.getVendorIdByName)(vendorName);
        if (vendorId)
            filters.vendorId = vendorId;
    }
    if (companyName) {
        const companyId = yield (0, getByName_1.getCompanyIdByName)(companyName);
        if (companyId)
            filters.companyId = companyId;
    }
    const skip = (page - 1) * limit;
    const deals = yield deals_model_1.Deal.find(filters)
        .skip(skip)
        .limit(Number(limit))
        .populate('vendorId', 'name logo website') // Populate vendor details
        .populate('companyId', 'name'); // Populate company name
    const total = yield deals_model_1.Deal.countDocuments(filters);
    // Using returnWithMeta utility for consistent response format
    return (0, returnWithMeta_1.returnWithMeta)({ total, limit: Number(limit), page: Number(page) }, deals);
});
const getAllActiveDeals = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (query = {}) {
    const currentDate = new Date();
    // Set default values for page and limit
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    // Fetch all non-expired deals with pagination
    const activeDeals = yield deals_model_1.Deal.find({
        expiryDate: { $gte: currentDate }, // Only non-expired deals
    })
        .skip(skip)
        .limit(limit)
        .populate('vendorId', 'name logo website') // Populate vendor details
        .populate('companyId', 'name'); // Populate company details
    // Count the total number of active deals
    const total = yield deals_model_1.Deal.countDocuments({
        expiryDate: { $gte: currentDate },
    });
    // Return the response with meta data
    return (0, returnWithMeta_1.returnWithMeta)({ total, limit, page }, activeDeals);
});
// Fetch Top Deals
const getTopDeals = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (query = {}) {
    const currentDate = new Date();
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    // Fetch the best non-expired cashback deals
    const cashbackDeals = yield deals_model_1.Deal.aggregate([
        {
            $match: {
                type: 'cashback',
                isActive: true,
                expiryDate: { $gte: currentDate },
            },
        },
        { $sort: { percentage: -1 } },
        { $group: { _id: '$companyId', bestCashbackDeal: { $first: '$$ROOT' } } },
    ]);
    // Fetch the best non-expired gift card deals
    const giftcardDeals = yield deals_model_1.Deal.aggregate([
        {
            $match: {
                type: 'giftcard',
                isActive: true,
                expiryDate: { $gte: currentDate },
            },
        },
        { $sort: { percentage: -1 } },
        { $group: { _id: '$companyId', bestGiftcardDeal: { $first: '$$ROOT' } } },
    ]);
    // Fetch the best non-expired credit card deals
    const creditCardDeals = yield deals_model_1.Deal.find({
        type: 'creditcard',
        isActive: true,
        expiryDate: { $gte: currentDate }, // Only fetch non-expired deals
    }).populate('vendorId', 'name logo website'); // Populate vendor details
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
            title: deal.title,
            link: deal.link,
        });
    });
    // Fetch all company details for unique companyIds
    const companyIds = [
        ...new Set([
            ...cashbackMap.keys(),
            ...giftcardMap.keys(),
            ...creditCardMap.keys(),
        ]),
    ];
    const companies = yield company_model_1.Company.find({ _id: { $in: companyIds } })
        .skip(skip)
        .limit(limit);
    // Total count for pagination meta
    const total = companyIds.length;
    // Combine results and calculate stackingLevel per company
    const data = companies.map((company) => {
        const companyId = company._id.toString();
        // Calculate stacking level for the current company
        let stackingLevel = 0;
        if (cashbackMap.has(companyId))
            stackingLevel++;
        if (giftcardMap.has(companyId))
            stackingLevel++;
        if (creditCardMap.has(companyId))
            stackingLevel++;
        return {
            company: {
                id: companyId,
                name: company.name,
                logo: company.logo,
                website: company.website,
            },
            bestCashbackDeal: cashbackMap.get(companyId) || null,
            bestGiftcardDeal: giftcardMap.get(companyId) || null,
            creditCardDeals: creditCardMap.get(companyId) || [],
            stackingLevel, // Stacking level specific to this company
        };
    });
    // Return with meta
    return (0, returnWithMeta_1.returnWithMeta)({ total, limit, page }, data);
});
const getBestCashbackRateByCompany = (companyName_1, ...args_1) => __awaiter(void 0, [companyName_1, ...args_1], void 0, function* (companyName, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    // Fetch all cashback deals for the given company (active and expired)
    const deals = yield deals_model_1.Deal.aggregate([
        {
            $match: {
                type: 'cashback',
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
        { $unwind: '$company' }, // Flatten company array
        { $match: { 'company.name': companyName } }, // Filter by company name
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                },
                bestCashbackRate: { $max: '$percentage' }, // Get the max cashback rate for each date
            },
        },
        { $sort: { '_id.date': 1 } }, // Sort by date ascending
        { $skip: skip }, // Implement pagination (skip)
        { $limit: limit }, // Implement pagination (limit)
    ]);
    // Count total results for meta information
    const totalResultsAggregation = yield deals_model_1.Deal.aggregate([
        {
            $match: {
                type: 'cashback',
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
        { $unwind: '$company' },
        { $match: { 'company.name': companyName } },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                },
                bestCashbackRate: { $max: '$percentage' },
            },
        },
        { $count: 'total' }, // Count the total number of results
    ]);
    const totalResults = totalResultsAggregation.length > 0 ? totalResultsAggregation[0].total : 0;
    // Format the results
    const formattedDeals = deals.map((deal) => ({
        date: deal._id.date,
        cashbackRate: deal.bestCashbackRate,
    }));
    // Return the deals with meta information
    return {
        meta: {
            total: totalResults,
            limit,
            page,
        },
        data: formattedDeals,
    };
});
const getBestGiftcardRateByCompany = (companyName_1, ...args_1) => __awaiter(void 0, [companyName_1, ...args_1], void 0, function* (companyName, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    // Fetch gift card deals for the given company with pagination
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
                _id: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                },
                bestGiftcardRate: { $max: '$percentage' }, // Get the max gift card rate for each date
            },
        },
        { $sort: { '_id.date': 1 } }, // Sort by date in ascending order
        { $skip: skip }, // Implement pagination (skip)
        { $limit: limit }, // Implement pagination (limit)
    ]);
    // Count total results for meta information
    const totalResultsAggregation = yield deals_model_1.Deal.aggregate([
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
        { $unwind: '$company' },
        { $match: { 'company.name': companyName } },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                },
                bestGiftcardRate: { $max: '$percentage' },
            },
        },
        { $count: 'total' }, // Count the total number of results
    ]);
    const totalResults = totalResultsAggregation.length > 0 ? totalResultsAggregation[0].total : 0;
    // Format the results
    const formattedDeals = deals.map((deal) => ({
        date: deal._id.date,
        giftcardRate: deal.bestGiftcardRate,
    }));
    // Return the deals with meta information
    return {
        meta: {
            total: totalResults,
            limit,
            page,
        },
        data: formattedDeals,
    };
});
const getActiveCashbackDeals = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const currentDate = new Date();
    // Fetch all active cashback deals with pagination
    const deals = yield deals_model_1.Deal.find({
        type: 'cashback', // Only cashback deals
        isActive: true, // Only active deals
        expiryDate: { $gte: currentDate }, // Deals that haven't expired
    })
        .sort({ percentage: -1 }) // Sort from best to worst by percentage
        .skip(skip) // Apply pagination
        .limit(limit) // Apply limit
        .populate('vendorId', 'name logo website') // Populate vendor details
        .populate('companyId', 'name'); // Populate company details
    // Count total active cashback deals for meta information
    const total = yield deals_model_1.Deal.countDocuments({
        type: 'cashback',
        isActive: true,
        expiryDate: { $gte: currentDate },
    });
    // Return the deals with meta information
    return {
        meta: {
            total,
            limit,
            page,
        },
        data: deals,
    };
});
const getActiveGiftcardDeals = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const currentDate = new Date();
    // Fetch all active gift card deals with pagination and sorting
    const deals = yield deals_model_1.Deal.find({
        type: 'giftcard', // Only gift card deals
        isActive: true, // Only active deals
        expiryDate: { $gte: currentDate }, // Deals that haven't expired
    })
        .sort({ percentage: -1 }) // Sort from best to worst by percentage
        .skip(skip) // Apply pagination
        .limit(limit) // Apply limit
        .populate('vendorId', 'name logo website') // Populate vendor details
        .populate('companyId', 'name'); // Populate company details
    // Count total active gift card deals for meta information
    const total = yield deals_model_1.Deal.countDocuments({
        type: 'giftcard',
        isActive: true,
        expiryDate: { $gte: currentDate },
    });
    // Return the deals with meta information
    return {
        meta: {
            total,
            limit,
            page,
        },
        data: deals,
    };
});
const getActiveCreditcardDeals = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const currentDate = new Date();
    // Fetch all active credit card deals with pagination and sorting
    const deals = yield deals_model_1.Deal.find({
        type: 'creditcard', // Only credit card deals
        isActive: true, // Only active deals
        expiryDate: { $gte: currentDate }, // Deals that haven't expired
    })
        .sort({ percentage: -1 }) // Sort from best to worst by percentage
        .skip(skip) // Apply pagination
        .limit(limit) // Apply limit
        .populate('vendorId', 'name logo website') // Populate vendor details
        .populate('companyId', 'name'); // Populate company details
    // Count total active credit card deals for meta information
    const total = yield deals_model_1.Deal.countDocuments({
        type: 'creditcard',
        isActive: true,
        expiryDate: { $gte: currentDate },
    });
    // Return the deals with meta information
    return {
        meta: {
            total,
            limit,
            page,
        },
        data: deals,
    };
});
const getExpiringCreditcardDealsByVendor = (vendorName_1, ...args_1) => __awaiter(void 0, [vendorName_1, ...args_1], void 0, function* (vendorName, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const currentDate = new Date();
    // Find the vendor by name
    const vendor = yield vendor_model_1.Vendor.findOne({ name: vendorName });
    if (!vendor)
        throw new Error('Vendor not found');
    // Fetch credit card deals for the vendor that are expiring soon with pagination
    const deals = yield deals_model_1.Deal.find({
        type: 'creditcard', // Only credit card deals
        isActive: true, // Only active deals
        expiryDate: { $gte: currentDate }, // Deals that haven't expired yet
        vendorId: vendor._id, // Filter by vendor ID
    })
        .sort({ expiryDate: 1 }) // Sort by expiry date (soonest first)
        .skip(skip) // Apply pagination
        .limit(limit) // Apply limit
        .populate('vendorId', 'name logo website') // Populate vendor details
        .populate('companyId', 'name'); // Populate company details
    // Count total expiring credit card deals for this vendor
    const total = yield deals_model_1.Deal.countDocuments({
        type: 'creditcard',
        isActive: true,
        expiryDate: { $gte: currentDate },
        vendorId: vendor._id,
    });
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    // Return the deals with meta information
    return {
        meta: {
            total,
            limit,
            page,
            totalPages,
        },
        data: deals,
    };
});
const deleteOldDeals = (date, days) => __awaiter(void 0, void 0, void 0, function* () {
    let targetDate = null;
    if (date) {
        targetDate = new Date(date);
        if (isNaN(targetDate.getTime()))
            throw new Error('Invalid date format.');
    }
    else if (days) {
        const daysInt = parseInt(days, 10);
        if (isNaN(daysInt) || daysInt <= 0)
            throw new Error('Invalid number of days.');
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - daysInt);
    }
    else {
        throw new Error('Please provide either a date or days.');
    }
    const result = yield deals_model_1.Deal.deleteMany({ createdAt: { $lt: targetDate } });
    return {
        message: `Deals older than ${targetDate.toISOString()} have been deleted.`,
        deletedCount: result.deletedCount || 0,
    };
});
const getAllCreditcardDeals = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = query;
    const filters = { type: 'creditcard' };
    const skip = (page - 1) * limit;
    const deals = yield deals_model_1.Deal.find(filters)
        .skip(skip)
        .limit(limit)
        .populate('vendorId', 'name logo website') // Populate vendor details
        .populate('companyId', 'name'); // Populate company details
    const total = yield deals_model_1.Deal.countDocuments(filters);
    return (0, returnWithMeta_1.returnWithMeta)({ total, limit: Number(limit), page: Number(page) }, deals);
});
// const getTopDealsFromFavorites = async (userId: string) => {
//   try {
//     // Find the user and their favorite companies
//     const user = await User.findById(userId).populate('favorites', '_id name')
//     if (!user || !user.favorites || user.favorites.length === 0) {
//       return []
//     }
//     // Extract favorite company IDs
//     const favoriteCompanyIds = user.favorites.map((favorite) =>
//       favorite._id.toString(),
//     )
//     console.log('Favorite Company IDs:', favoriteCompanyIds[0])
//     // Ensure that `favoriteCompanyIds` contains valid ObjectIds
//     const currentDate = new Date()
//     // Fetch top deals for favorite companies
//     const topDeals = await Deal.aggregate([
//       {
//         $match: {
//           companyId: favoriteCompanyIds[0].toString(), // Filter deals only for favorite companies
//           isActive: true, // Ensure deals are active
//           expiryDate: { $gte: currentDate }, // Ensure deals are not expired
//         },
//       },
//       {
//         $sort: { percentage: -1 }, // Sort by percentage in descending order
//       },
//       {
//         $group: {
//           _id: '$companyId', // Group by company
//           topDeal: { $first: '$$ROOT' }, // Take the first (top) deal
//         },
//       },
//       {
//         $lookup: {
//           from: 'companies', // Join with the companies collection
//           localField: '_id',
//           foreignField: '_id',
//           as: 'company',
//         },
//       },
//       {
//         $unwind: '$company', // Flatten the company array
//       },
//       {
//         $lookup: {
//           from: 'vendors', // Join with the vendors collection
//           localField: 'topDeal.vendorId',
//           foreignField: '_id',
//           as: 'vendor',
//         },
//       },
//       {
//         $unwind: { path: '$vendor', preserveNullAndEmptyArrays: true }, // Flatten vendor array
//       },
//       {
//         $project: {
//           _id: 0,
//           company: { _id: '$company._id', name: '$company.name' },
//           deal: {
//             title: '$topDeal.title',
//             percentage: '$topDeal.percentage',
//             type: '$topDeal.type',
//             link: '$topDeal.link',
//             expiryDate: '$topDeal.expiryDate',
//           },
//           vendor: {
//             _id: '$vendor._id',
//             name: '$vendor.name',
//             logo: '$vendor.logo',
//           },
//         },
//       },
//     ])
//     return topDeals
//   } catch (error) {
//     console.error('Error fetching top deals from favorites:', error)
//     throw new Error('Failed to fetch top deals from favorite companies.')
//   }
// }
exports.DealServices = {
    getAllDeals,
    getAllActiveDeals,
    getBestCashbackRateByCompany,
    getBestGiftcardRateByCompany,
    getActiveCashbackDeals,
    getActiveGiftcardDeals,
    getActiveCreditcardDeals,
    getExpiringCreditcardDealsByVendor,
    getTopDeals,
    processCSVData,
    deleteOldDeals,
    getAllCreditcardDeals,
    // getTopDealsFromFavorites,
};

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
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const deals_model_1 = require("./deals.model");
const processCSV = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const deals = [];
    // Read and parse the CSV file
    yield new Promise((resolve, reject) => {
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            deals.push(row);
        })
            .on('end', () => {
            resolve();
        })
            .on('error', (error) => {
            reject(error);
        });
    });
    // Process each deal (create or update)
    for (const deal of deals) {
        const { title, percentage, type, vendorId, companyId, expiryDate, link } = deal;
        // Check if the deal already exists
        const existingDeal = yield deals_model_1.Deal.findOne({ title, vendorId, companyId });
        if (existingDeal) {
            // Update existing deal
            existingDeal.percentage = percentage;
            existingDeal.type = type;
            existingDeal.expiryDate = new Date(expiryDate);
            existingDeal.link = link;
            existingDeal.isActive = new Date(expiryDate) > new Date();
            yield existingDeal.save();
        }
        else {
            // Create a new deal
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
        }
    }
    // Delete the uploaded file after processing
    fs_1.default.unlinkSync(filePath);
    return `Processed ${deals.length} deals successfully.`;
});
const getAllDeals = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, vendorId, companyId } = query;
    const filter = { isActive: true };
    if (type)
        filter.type = type;
    if (vendorId)
        filter.vendorId = vendorId;
    if (companyId)
        filter.companyId = companyId;
    return yield deals_model_1.Deal.find(filter).populate(['vendorId', 'companyId']);
});
const getTopDeals = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield deals_model_1.Deal.aggregate([
        { $match: { isActive: true } },
        { $sort: { percentage: -1 } },
        { $group: { _id: '$companyId', topDeal: { $first: '$$ROOT' } } },
        { $replaceRoot: { newRoot: '$topDeal' } },
    ]);
});
exports.DealServices = {
    processCSV,
    getAllDeals,
    getTopDeals,
};

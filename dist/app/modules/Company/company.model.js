"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const mongoose_1 = require("mongoose");
const companySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Company name is required'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    website: {
        type: String,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});
exports.Company = (0, mongoose_1.model)('Company', companySchema);

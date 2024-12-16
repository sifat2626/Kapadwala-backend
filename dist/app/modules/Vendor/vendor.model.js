"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendor = void 0;
const mongoose_1 = require("mongoose");
const vendorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Vendor name is required'],
        unique: true,
        trim: true,
    },
    logo: {
        type: String,
        required: [true, 'Vendor logo URL is required'],
    },
    website: {
        type: String,
        required: [true, 'Vendor website URL is required'],
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});
exports.Vendor = (0, mongoose_1.model)('Vendor', vendorSchema);

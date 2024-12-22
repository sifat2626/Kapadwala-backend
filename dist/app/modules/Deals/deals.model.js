"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deal = void 0;
const mongoose_1 = require("mongoose");
const dealSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Deal title is required'],
        trim: true,
    },
    percentage: {
        type: Number,
        min: [0, 'Percentage cannot be less than 0'],
        default: 0,
        // eslint-disable-next-line no-unused-vars
        required: function () {
            return this.type !== 'creditcard';
        },
    },
    type: {
        type: String,
        enum: ['cashback', 'giftcard', 'creditcard'],
        required: [true, 'Deal type is required'],
    },
    vendorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: [true, 'Vendor reference is required'],
    },
    companyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
    },
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required'],
    },
    link: {
        type: String,
        required: [true, 'Link to the deal is required'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});
// Middleware to mark expired deals as inactive
dealSchema.pre('save', function (next) {
    if (this.expiryDate < new Date()) {
        this.isActive = false;
    }
    next();
});
exports.Deal = (0, mongoose_1.model)('Deal', dealSchema);

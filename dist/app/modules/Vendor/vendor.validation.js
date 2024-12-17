"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorValidation = void 0;
const zod_1 = require("zod");
const createVendor = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Vendor name is required' })
            .min(1, 'Vendor name cannot be empty'),
        logo: zod_1.z.string().optional(),
        website: zod_1.z.string().url('Invalid URL format').optional(),
    }),
});
const updateVendor = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        logo: zod_1.z.string().optional(),
        website: zod_1.z.string().url('Invalid URL format').optional(),
    }),
});
exports.VendorValidation = {
    createVendor,
    updateVendor,
};

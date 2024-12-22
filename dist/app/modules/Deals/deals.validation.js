"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealValidationSchema = void 0;
const zod_1 = require("zod");
exports.dealValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }),
        percentage: zod_1.z.number({ required_error: 'Percentage is required' }).min(0).optional(),
        type: zod_1.z.enum(['cashback', 'giftcard', 'creditcard'], {
            required_error: 'Type is required',
        }),
        vendorId: zod_1.z.string({ required_error: 'Vendor ID is required' }),
        companyId: zod_1.z.string({ required_error: 'Company ID is required' }),
        expiryDate: zod_1.z.string({ required_error: 'Expiry date is required' }),
        link: zod_1.z.string({ required_error: 'Link is required' }).url(),
    }),
});

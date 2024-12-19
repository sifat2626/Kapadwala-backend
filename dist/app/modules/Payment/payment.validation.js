"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const zod_1 = require("zod");
// Validation schema for creating a payment session
const createPaymentSession = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().min(1, { message: 'Amount must be at least 1' }),
        currency: zod_1.z.string().nonempty({ message: 'Currency is required' }),
    }),
});
exports.PaymentValidation = {
    createPaymentSession,
};

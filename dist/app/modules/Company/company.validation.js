"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyValidation = void 0;
const zod_1 = require("zod");
const createCompany = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Company name is required' })
            .min(1, 'Company name cannot be empty'),
        description: zod_1.z.string().optional(),
        logo: zod_1.z.string().url('Logo must be a valid URL').optional(),
        website: zod_1.z.string().url('Website must be a valid URL').optional(),
    }),
});
const updateCompany = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        logo: zod_1.z.string().url('Logo must be a valid URL').optional(),
        website: zod_1.z.string().url('Website must be a valid URL').optional(),
    }),
});
exports.CompanyValidation = {
    createCompany,
    updateCompany,
};

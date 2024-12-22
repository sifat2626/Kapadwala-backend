"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
// Validation schema for creating a user
const userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'User name is required.' }),
        email: zod_1.z.string().email({ message: 'A valid email is required.' }),
        password: zod_1.z
            .string({
            invalid_type_error: 'Password must be a string.',
        })
            .max(20, { message: 'Password cannot exceed 20 characters.' })
            .min(5, { message: 'Password must be at least 5 characters long.' }),
    }),
});
// Validation schema for updating a user's role
const updateUserRoleValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.enum([...user_constant_1.UserRoleEnum], {
            required_error: 'Role is required.',
        }),
    }),
});
// Validation schema for subscribing a user
const subscribeUserValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({
            required_error: 'User ID is required for subscription.',
        }),
    }),
});
exports.UserValidation = {
    userValidationSchema,
    updateUserRoleValidationSchema,
    subscribeUserValidationSchema,
};

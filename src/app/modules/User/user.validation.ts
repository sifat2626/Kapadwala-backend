import { z } from 'zod';
import { UserRoleEnum } from './user.constant';

// Validation schema for creating a user
const userValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'User name is required.' }),
    email: z.string().email({ message: 'A valid email is required.' }),
    password: z
      .string({
        invalid_type_error: 'Password must be a string.',
      })
      .max(20, { message: 'Password cannot exceed 20 characters.' })
      .min(5, { message: 'Password must be at least 5 characters long.' }),
  }),
});

// Validation schema for updating a user's role
const updateUserRoleValidationSchema = z.object({
  body: z.object({
    role: z.enum([...UserRoleEnum] as [string, ...string[]], {
      required_error: 'Role is required.',
    }),
  }),
});

// Validation schema for subscribing a user
const subscribeUserValidationSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'User ID is required for subscription.',
    }),
  }),
});

export const UserValidation = {
  userValidationSchema,
  updateUserRoleValidationSchema,
  subscribeUserValidationSchema,
};

import { z } from 'zod';

const createVendor = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Vendor name is required' })
      .min(1, 'Vendor name cannot be empty'),
    logo: z.string().optional(),
    website: z.string().url('Invalid URL format').optional(),
  }),
});

const updateVendor = z.object({
  body: z.object({
    name: z.string().optional(),
    logo: z.string().optional(),
    website: z.string().url('Invalid URL format').optional(),
  }),
});

export const VendorValidation = {
  createVendor,
  updateVendor,
};

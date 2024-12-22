import { z } from 'zod';

const createCompany = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Company name is required' })
      .min(1, 'Company name cannot be empty'),
    logo: z.string().url('Logo must be a valid URL').optional(),
    website: z.string().url('Website must be a valid URL').optional(),
  }),
});

const updateCompany = z.object({
  body: z.object({
    name: z.string().optional(),
    logo: z.string().url('Logo must be a valid URL').optional(),
    website: z.string().url('Website must be a valid URL').optional(),
  }),
});

export const CompanyValidation = {
  createCompany,
  updateCompany,
};

import { z } from 'zod';

export const dealValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    percentage: z.number({ required_error: 'Percentage is required' }).min(0).optional(),
    type: z.enum(['cashback', 'giftcard', 'creditcard'], {
      required_error: 'Type is required',
    }),
    vendorId: z.string({ required_error: 'Vendor ID is required' }),
    companyId: z.string({ required_error: 'Company ID is required' }),
    expiryDate: z.string({ required_error: 'Expiry date is required' }),
    link: z.string({ required_error: 'Link is required' }).url(),
  }),
});

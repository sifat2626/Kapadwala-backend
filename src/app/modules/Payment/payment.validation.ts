import { z } from 'zod';

// Validation schema for creating a payment session
const createPaymentSession = z.object({
  body: z.object({
    amount: z.number().min(1, { message: 'Amount must be at least 1' }),
    currency: z.string().nonempty({ message: 'Currency is required' }),
  }),
});

export const PaymentValidation = {
  createPaymentSession,
};

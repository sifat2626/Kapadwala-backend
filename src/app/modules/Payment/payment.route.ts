import { Router } from 'express';
import { PaymentController } from './payment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentValidation } from './payment.validation';
import protect from '../../middlewares/protect';

const router = Router();

// Route to create a payment session
router.post(
  '/create-session', PaymentController.createPayment
);

// // Route to handle Stripe webhook
// router.post('/webhook',express.raw({ type: 'application/json' }), PaymentController.stripeWebhook);

export const PaymentRoutes = router;

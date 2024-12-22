import { Router } from 'express';
import { PaymentController } from './payment.controller';
import protect from '../../middlewares/protect';

const router = Router();

// Route to create a payment session
router.post(
  '/create-session',protect(), PaymentController.createPayment
);
router.post(
  '/cancel-subscription',protect(), PaymentController.cancelSubscription
);

// // Route to handle Stripe webhook
// router.post('/webhook',express.raw({ type: 'application/json' }), PaymentController.stripeWebhook);

export const PaymentRoutes = router;

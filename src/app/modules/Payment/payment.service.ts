import Stripe from 'stripe';
import config from '../../config';
import { User } from '../User/user.model';

// Initialize Stripe


// Create a Stripe payment session

// Handle webhook events from Stripe
const handleStripeWebhook = async (event: Stripe.Event) => {
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      // Define the required payment amount
      const REQUIRED_PAYMENT_AMOUNT = Number(config.required_payment_amount); // e.g., 1000 cents = $10.00

      // Get the total amount paid from the session
      const amountTotal = session.amount_total ?? 0;

      // Validate the payment amount
      if (amountTotal !== REQUIRED_PAYMENT_AMOUNT) {
        console.error(
          `Invalid payment amount. Expected: ${REQUIRED_PAYMENT_AMOUNT / 100}, Received: ${amountTotal / 100}`
        );
        return;
      }

      if (userId) {
        console.log(`Updating subscription for user: ${userId}`);
        // Update user's subscription status and last payment info
        await User.findByIdAndUpdate(userId, {
          isSubscribed: true,
          subscriptionDate: new Date(),
          lastPayment: {
            amount: amountTotal / 100, // Convert cents to dollars
            currency: session.currency || 'usd',
            status: 'completed',
            transactionId: session.id,
            paymentDate: new Date(),
          },
        });
        console.log('Subscription updated successfully.');
      }
    } else {
      console.warn(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
  }
};

export const PaymentService = {
  handleStripeWebhook,
};

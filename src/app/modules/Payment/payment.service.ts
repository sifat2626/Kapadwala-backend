import Stripe from 'stripe';
import { User } from '../User/user.model';

// Initialize Stripe


// Create a Stripe payment session

// Handle webhook events from Stripe
const handleStripeWebhook = async (event: Stripe.Event) => {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('Checkout session completed:', session); // Log the entire session object

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string; // This should contain the subscription ID

        console.log('Customer ID:', customerId);
        console.log('Subscription ID:', subscriptionId); // Log to verify

        // Find the user by customer ID
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (!user) {
          console.error('User not found for customer ID:', customerId);
          return;
        }

        // Update the user's subscription status and ID
        user.isSubscribed = true;
        user.subscriptionDate = new Date();
        user.stripeSubscriptionId = subscriptionId; // Update the subscription ID
        await user.save();

        console.log('User subscription updated:', user);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
  }
};



export const PaymentService = {
  handleStripeWebhook,
};

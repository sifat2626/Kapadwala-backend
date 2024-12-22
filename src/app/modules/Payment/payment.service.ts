import Stripe from 'stripe';
import { User } from '../User/user.model';

const handleStripeWebhook = async (event: Stripe.Event) => {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('Checkout session completed:', session);

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string; // Subscription ID
        const paymentIntentId = session.payment_intent as string | null; // Payment Intent ID (may be null in subscription mode)

        console.log('Customer ID:', customerId);
        console.log('Subscription ID:', subscriptionId);
        console.log('Payment Intent ID:', paymentIntentId);

        // Find the user by Stripe customer ID
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (!user) {
          console.error('User not found for customer ID:', customerId);
          return;
        }

        // Initialize Stripe
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
          apiVersion: '2024-11-20.acacia',
        });

        let paymentDetails = null;

        if (subscriptionId) {
          // Retrieve the subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          // Retrieve the latest invoice from the subscription
          const latestInvoice = subscription.latest_invoice as string;
          if (latestInvoice) {
            const invoice = await stripe.invoices.retrieve(latestInvoice);

            // Retrieve the Payment Intent from the invoice
            if (invoice.payment_intent) {
              const paymentIntent = await stripe.paymentIntents.retrieve(
                invoice.payment_intent as string,
              );

              paymentDetails = {
                amount: paymentIntent.amount / 100, // Convert from cents to dollars
                currency: paymentIntent.currency,
                status: paymentIntent.status as 'completed' | 'pending' | 'failed',
                transactionId: paymentIntent.id,
                paymentDate: new Date(paymentIntent.created * 1000), // Convert timestamp to Date
              };
            }
          }
        }

        // Update the user record
        user.isSubscribed = true;
        user.subscriptionDate = new Date();
        user.expiresAt = subscriptionId
          ? new Date((await stripe.subscriptions.retrieve(subscriptionId)).current_period_end * 1000)
          : null; // Set expiration date
        user.stripeSubscriptionId = subscriptionId || null;
        user.lastPayment = paymentDetails || user.lastPayment; // Update payment details

        await user.save();

        console.log('User subscription updated successfully:', user);
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

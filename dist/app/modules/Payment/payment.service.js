"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const user_model_1 = require("../User/user.model");
const handleStripeWebhook = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log('Checkout session completed:', session);
                const customerId = session.customer;
                const subscriptionId = session.subscription; // Subscription ID
                const paymentIntentId = session.payment_intent; // Payment Intent ID (may be null in subscription mode)
                console.log('Customer ID:', customerId);
                console.log('Subscription ID:', subscriptionId);
                console.log('Payment Intent ID:', paymentIntentId);
                // Find the user by Stripe customer ID
                const user = yield user_model_1.User.findOne({ stripeCustomerId: customerId });
                if (!user) {
                    console.error('User not found for customer ID:', customerId);
                    return;
                }
                // Initialize Stripe
                const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
                    apiVersion: '2024-11-20.acacia',
                });
                let paymentDetails = null;
                if (subscriptionId) {
                    // Retrieve the subscription details
                    const subscription = yield stripe.subscriptions.retrieve(subscriptionId);
                    // Retrieve the latest invoice from the subscription
                    const latestInvoice = subscription.latest_invoice;
                    if (latestInvoice) {
                        const invoice = yield stripe.invoices.retrieve(latestInvoice);
                        // Retrieve the Payment Intent from the invoice
                        if (invoice.payment_intent) {
                            const paymentIntent = yield stripe.paymentIntents.retrieve(invoice.payment_intent);
                            paymentDetails = {
                                amount: paymentIntent.amount / 100, // Convert from cents to dollars
                                currency: paymentIntent.currency,
                                status: paymentIntent.status, // Use Stripe-compatible status
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
                    ? new Date((yield stripe.subscriptions.retrieve(subscriptionId)).current_period_end * 1000)
                    : null; // Set expiration date
                user.stripeSubscriptionId = subscriptionId || null;
                user.lastPayment = paymentDetails || user.lastPayment; // Update payment details
                yield user.save();
                console.log('User subscription updated successfully:', user);
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }
    catch (error) {
        console.error('Error handling Stripe webhook:', error);
    }
});
exports.PaymentService = {
    handleStripeWebhook,
};

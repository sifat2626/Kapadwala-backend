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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const user_model_1 = require("../User/user.model");
// Initialize Stripe
// Create a Stripe payment session
// Handle webhook events from Stripe
const handleStripeWebhook = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log('Checkout session completed:', session); // Log the entire session object
                const customerId = session.customer;
                const subscriptionId = session.subscription; // This should contain the subscription ID
                console.log('Customer ID:', customerId);
                console.log('Subscription ID:', subscriptionId); // Log to verify
                // Find the user by customer ID
                const user = yield user_model_1.User.findOne({ stripeCustomerId: customerId });
                if (!user) {
                    console.error('User not found for customer ID:', customerId);
                    return;
                }
                // Update the user's subscription status and ID
                user.isSubscribed = true;
                user.subscriptionDate = new Date();
                user.stripeSubscriptionId = subscriptionId; // Update the subscription ID
                yield user.save();
                console.log('User subscription updated:', user);
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

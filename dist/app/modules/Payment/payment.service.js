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
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../User/user.model");
// Initialize Stripe
const stripe = new stripe_1.default(config_1.default.stripe_secret_key, {
    apiVersion: '2024-11-20.acacia',
});
// Create a Stripe payment session
const createPaymentSession = (userId, amount, currency) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const session = yield stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: 'Subscription Plan',
                    },
                    unit_amount: amount, // Stripe expects amount in cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${config_1.default.frontend_url}/payment-success`,
        cancel_url: `${config_1.default.frontend_url}/payment-failure`,
        metadata: {
            userId,
        },
    });
    return session;
});
// Handle webhook events from Stripe
const handleStripeWebhook = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId;
            // Define the required payment amount
            const REQUIRED_PAYMENT_AMOUNT = Number(config_1.default.required_payment_amount); // e.g., 1000 cents = $10.00
            // Get the total amount paid from the session
            const amountTotal = (_b = session.amount_total) !== null && _b !== void 0 ? _b : 0;
            // Validate the payment amount
            if (amountTotal !== REQUIRED_PAYMENT_AMOUNT) {
                console.error(`Invalid payment amount. Expected: ${REQUIRED_PAYMENT_AMOUNT / 100}, Received: ${amountTotal / 100}`);
                return;
            }
            if (userId) {
                console.log(`Updating subscription for user: ${userId}`);
                // Update user's subscription status and last payment info
                yield user_model_1.User.findByIdAndUpdate(userId, {
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
        }
        else {
            console.warn(`Unhandled event type: ${event.type}`);
        }
    }
    catch (error) {
        console.error('Error handling Stripe webhook:', error);
    }
});
exports.PaymentService = {
    createPaymentSession,
    handleStripeWebhook,
};

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
exports.PaymentController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const payment_service_1 = require("./payment.service");
const user_model_1 = require("../User/user.model");
// Create a Stripe payment session
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stripe = new stripe_1.default(config_1.default.stripe_secret_key, {
            apiVersion: '2024-11-20.acacia',
        });
        // Step 1: Extract user ID from authentication middleware
        const userId = req.user._id; // Assuming `req.user` is populated by authentication middleware
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required to create a subscription.',
            });
        }
        // Step 2: Fetch the user from the database
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }
        // Step 3: Create or retrieve the Stripe customer
        let stripeCustomerId = user.stripeCustomerId;
        if (!stripeCustomerId) {
            try {
                const customer = yield stripe.customers.create({
                    email: user.email,
                    name: user.name,
                });
                stripeCustomerId = customer.id;
                // Save the Stripe customer ID in the user record
                user.stripeCustomerId = stripeCustomerId;
                yield user.save();
            }
            catch (error) {
                console.error('Error creating Stripe customer:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create Stripe customer.',
                });
            }
        }
        // Step 4: Create a Stripe Checkout session
        let session;
        try {
            session = yield stripe.checkout.sessions.create({
                payment_method_types: ['card'], // Accept card payments
                customer: stripeCustomerId,
                line_items: [
                    {
                        price: config_1.default.stripe_price_id, // Replace with your Stripe price ID
                        quantity: 1,
                    },
                ],
                mode: 'subscription', // Ensure the mode is set to 'subscription'
                success_url: `${config_1.default.client_url}/success?session_id={CHECKOUT_SESSION_ID}`, // Redirect on success
                cancel_url: `${config_1.default.client_url}/cancel`, // Redirect on cancellation
            });
        }
        catch (error) {
            console.error('Error creating Stripe Checkout session:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create Stripe Checkout session.',
            });
        }
        // Step 5: Return the session URL to the client
        res.status(200).json({
            success: true,
            message: 'Checkout session created successfully.',
            data: {
                url: session.url, // Stripe-hosted payment page URL
            },
        });
    }
    catch (error) {
        console.error('Error in createPayment function:', error);
        res.status(500).json({
            success: false,
            message: 'An internal server error occurred while creating the subscription.',
        });
    }
});
// Handle Stripe webhook
const stripeWebhook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'Missing Stripe signature header.',
            data: null,
        });
    }
    const stripe = new stripe_1.default(config_1.default.stripe_secret_key, {
        apiVersion: '2024-11-20.acacia',
    });
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, // Raw body
        sig, config_1.default.stripe_webhook_secret // Webhook secret
        );
        console.log(`Webhook Verified: ${event.type}`);
    }
    catch (error) {
        console.error('Webhook signature verification failed:', error);
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: `Webhook signature verification failed: ${error.message}`,
            data: null,
        });
    }
    try {
        yield payment_service_1.PaymentService.handleStripeWebhook(event);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Webhook processed successfully.',
            data: { received: true },
        });
    }
    catch (error) {
        console.error('Error processing Stripe webhook:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            success: false,
            message: 'An error occurred while processing the webhook.',
            data: null,
        });
    }
}));
exports.PaymentController = {
    createPayment,
    stripeWebhook,
};

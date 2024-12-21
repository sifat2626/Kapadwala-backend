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
// Create a Stripe payment session
const createPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Initialize Stripe
        const stripe = new stripe_1.default(config_1.default.stripe_secret_key, { apiVersion: '2024-11-20.acacia' });
        // Extract currency and amount from the request body
        const { currency, amount } = req.body;
        // Validate input
        if (!currency || typeof currency !== 'string') {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.BAD_REQUEST,
                success: false,
                message: 'Invalid or missing currency. Please provide a valid currency.',
                data: null,
            });
        }
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.BAD_REQUEST,
                success: false,
                message: 'Invalid or missing amount. Please provide a valid positive amount.',
                data: null,
            });
        }
        // Create a Stripe payment session
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: { name: 'Product Name' },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${config_1.default.client_url}/success`,
            cancel_url: `${config_1.default.client_url}/cancel`,
        });
        // Return success response
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Payment session created successfully.',
            data: session,
        });
    }
    catch (error) {
        console.error('Error creating payment session:', error);
        // Check for specific Stripe errors
        if (error instanceof stripe_1.default.errors.StripeError) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.BAD_REQUEST,
                success: false,
                message: error.message || 'An error occurred while creating the payment session with Stripe.',
                data: null,
            });
        }
        // Generic error response
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            success: false,
            message: 'An internal server error occurred while creating the payment session.',
            data: null,
        });
    }
}));
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

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
const createPaymentSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { amount, currency } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.UNAUTHORIZED,
            success: false,
            message: 'You must be logged in to create a payment session.',
            data: null,
        });
    }
    const session = yield payment_service_1.PaymentService.createPaymentSession(userId, amount, currency);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payment session created successfully.',
        data: session,
    });
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
    yield payment_service_1.PaymentService.handleStripeWebhook(event);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Webhook processed successfully.',
        data: { received: true },
    });
}));
exports.PaymentController = {
    createPaymentSession,
    stripeWebhook,
};

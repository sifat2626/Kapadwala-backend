"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const protect_1 = __importDefault(require("../../middlewares/protect"));
const router = (0, express_1.Router)();
// Route to create a payment session
router.post('/create-session', (0, protect_1.default)(), payment_controller_1.PaymentController.createPayment);
router.post('/cancel-subscription', (0, protect_1.default)(), payment_controller_1.PaymentController.cancelSubscription);
// // Route to handle Stripe webhook
// router.post('/webhook',express.raw({ type: 'application/json' }), PaymentController.stripeWebhook);
exports.PaymentRoutes = router;

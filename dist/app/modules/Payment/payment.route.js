"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
// Route to create a payment session
router.post('/create-session', payment_controller_1.PaymentController.createPayment);
// // Route to handle Stripe webhook
// router.post('/webhook',express.raw({ type: 'application/json' }), PaymentController.stripeWebhook);
exports.PaymentRoutes = router;

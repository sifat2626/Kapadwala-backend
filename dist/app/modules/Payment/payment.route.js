"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const payment_validation_1 = require("./payment.validation");
const protect_1 = __importDefault(require("../../middlewares/protect"));
const router = (0, express_1.Router)();
// Route to create a payment session
router.post('/create-session', (0, protect_1.default)(), (0, validateRequest_1.default)(payment_validation_1.PaymentValidation.createPaymentSession), payment_controller_1.PaymentController.createPaymentSession);
// // Route to handle Stripe webhook
// router.post('/webhook',express.raw({ type: 'application/json' }), PaymentController.stripeWebhook);
exports.PaymentRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./app/modules/Payment/payment.controller");
require("./app/modules/NewsLetter/newsletter.cron");
const app = (0, express_1.default)();
// Route to handle Stripe webhook
app.post(`/api/v1/payments/webhook`, express_1.default.raw({ type: 'application/json' }), payment_controller_1.PaymentController.stripeWebhook);
//parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
}));
// app.use(morgan('dev'))
//
// // application routes
// app.use('/api/v1', router)
//
// app.get('/', (_req: Request, res: Response) => {
//   res.send('Hi, Server Root Route Working !')
// })
//
// app.get('/health', (_req: Request, res: Response) => {
//   res.send('Wow! Well API Health...')
// })
//
// app.use(globalErrorHandler)
//
// // Global Not Found
// app.use(notFound)
exports.default = app;

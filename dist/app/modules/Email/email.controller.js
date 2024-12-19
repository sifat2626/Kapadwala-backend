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
exports.EmailController = void 0;
const email_service_1 = require("../../utils/email.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const sendWelcomeEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name } = req.body;
    // Compose the email content
    const subject = 'Welcome to Our Platform!';
    const text = `Hi ${name},\n\nThank you for joining our platform. We're excited to have you onboard!`;
    const html = `<p>Hi <strong>${name}</strong>,</p><p>Thank you for joining our platform. We're excited to have you on board!</p>`;
    // Send the email
    yield email_service_1.EmailService.sendEmail(email, subject, text, html);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Welcome email sent successfully.',
        data: ''
    });
}));
exports.EmailController = {
    sendWelcomeEmail,
};

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
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
exports.EmailService = {
    sendEmail: (to, subject, text, html) => __awaiter(void 0, void 0, void 0, function* () {
        // Create a transporter
        const transporter = nodemailer_1.default.createTransport({
            host: config_1.default.email_host, // e.g., 'smtp.gmail.com'
            port: Number(config_1.default.email_port), // e.g., 587
            secure: config_1.default.email_secure === 'true', // Use SSL for secure connections
            auth: {
                user: config_1.default.email_user, // Your email address
                pass: config_1.default.email_password, // Your email password or app password
            },
        });
        // Email options
        const mailOptions = {
            from: `"Your Project Name" <${config_1.default.email_user}>`, // Sender address
            to, // Recipient address
            subject, // Subject line
            text, // Plain text version of the message
            html, // HTML version of the message
        };
        // Send the email
        const info = yield transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return info;
    }),
};

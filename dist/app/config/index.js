"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join((process.cwd(), '.env')) });
exports.default = {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    database_dev_url: process.env.DATABASE_DEV_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    default_password: process.env.DEFAULT_PASS,
    admin_password: process.env.ADMIN_PASSWORD,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    frontend_url: process.env.FRONTEND_URL,
    publishable_SECRET_key: process.env.PUBLISHABLE_SECRET_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    required_payment_amount: process.env.REQUIRED_PAYMENT_AMOUNT,
    email_host: process.env.EMAIL_HOST || '',
    email_port: process.env.EMAIL_PORT || 587,
    email_secure: process.env.EMAIL_SECURE || 'false',
    email_user: process.env.EMAIL_USER || '',
    email_password: process.env.EMAIL_PASSWORD || '',
    newslettre_hour: process.env.NEWSLETRE_HOUR || '8',
    reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
    reset_pass_ui_link_dev: process.env.RESET_PASS_UI_LINK_DEV,
};

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
    reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
    reset_pass_ui_link_dev: process.env.RESET_PASS_UI_LINK_DEV,
};

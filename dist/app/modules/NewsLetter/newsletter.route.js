"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const newsletter_controller_1 = require("./newsletter.controller");
const router = express_1.default.Router();
// Manually trigger the newsletter
router.post('/send', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), newsletter_controller_1.NewsletterController.sendNewsletterManually);
exports.NewsletterRoutes = router;

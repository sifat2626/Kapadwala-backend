"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailRoutes = void 0;
const express_1 = __importDefault(require("express"));
const email_controller_1 = require("./email.controller");
const protect_1 = __importDefault(require("../../middlewares/protect"));
const router = express_1.default.Router();
router.post('/send-welcome', (0, protect_1.default)(), email_controller_1.EmailController.sendWelcomeEmail);
exports.EmailRoutes = router;

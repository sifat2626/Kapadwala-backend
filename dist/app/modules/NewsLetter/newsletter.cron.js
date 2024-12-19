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
const node_cron_1 = __importDefault(require("node-cron"));
const newsletter_service_1 = require("./newsletter.service");
// Schedule the task to run daily at 8 AM
node_cron_1.default.schedule('*/10 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Sending daily newsletter...');
    try {
        yield newsletter_service_1.NewsletterService.sendDailyNewsletter();
        console.log('Daily newsletter sent successfully.');
    }
    catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        console.error('Failed to send daily newsletter:', error.message);
    }
}));

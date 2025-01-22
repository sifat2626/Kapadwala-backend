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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("../User/user.model");
const email_service_1 = require("../../utils/email.service");
const deals_model_1 = require("../Deals/deals.model");
exports.NewsletterService = {
    sendDailyNewsletter: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Step 1: Fetch all users who are subscribed to the newsletter
            const newsletterSubscribers = yield user_model_1.User.find({
                isSubscribedToNewsletter: true,
            }).select('newsLetterEmail name favorites favoriteCreditCardVendors');
            if (!newsletterSubscribers.length) {
                return;
            }
            // Step 2: Prepare and send the newsletter for each subscriber
            for (const subscriber of newsletterSubscribers) {
                const { favorites, favoriteCreditCardVendors, newsLetterEmail } = subscriber;
                // Use aggregation to fetch deals tailored to the user's favorites
                const personalizedDeals = yield deals_model_1.Deal.aggregate([
                    {
                        $match: {
                            $and: [
                                {
                                    $or: [
                                        { companyId: { $in: favorites.map((fav) => new mongoose_1.Types.ObjectId(fav)) } },
                                        { vendorId: { $in: favoriteCreditCardVendors.map((fav) => new mongoose_1.Types.ObjectId(fav)) } },
                                    ],
                                },
                                { expiryDate: { $gte: new Date() } },
                            ],
                        },
                    },
                    {
                        $lookup: {
                            from: 'companies',
                            localField: 'companyId',
                            foreignField: '_id',
                            as: 'companyDetails',
                        },
                    },
                    {
                        $unwind: '$companyDetails',
                    },
                ]);
                // Generate HTML content for the deals
                const dealsHtml = personalizedDeals
                    .map((deal) => {
                    const dealType = deal.type === 'cashback' ? 'Cashback' : 'Credit Card';
                    return `
                <h2>${dealType} Deal - ${deal.companyDetails.name}</h2>
                <ul>
                  <li><strong>Percentage:</strong> ${deal.percentage}%</li>
                  <li><a href="${deal.link}" target="_blank">View Deal</a></li>
                </ul>
              `;
                })
                    .join('');
                const emailHtml = `
          <h1>Your Favorite Deals</h1>
          ${dealsHtml}
          <p>Thank you for subscribing to our newsletter!</p>
        `;
                // Log the personalized deals being sent for debugging or auditing purposes
                console.log(`Sending the following deals to ${newsLetterEmail}:`, personalizedDeals);
                // Step 3: Send email to the subscriber
                const subject = 'Your Personalized Favorite Deals!';
                const text = 'Check out your favorite deals!';
                try {
                    yield email_service_1.EmailService.sendEmail(newsLetterEmail, subject, text, emailHtml);
                    console.log(`Newsletter sent to ${newsLetterEmail}`);
                }
                catch (error) {
                    console.error(`Failed to send email to ${newsLetterEmail}:`, error.message);
                }
            }
        }
        catch (error) {
            console.error('Error in sending daily newsletter:', error.message);
        }
    }),
};

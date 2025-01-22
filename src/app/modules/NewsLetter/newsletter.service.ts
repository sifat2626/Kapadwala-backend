import { Types } from 'mongoose';
import { User } from '../User/user.model';
import { EmailService } from '../../utils/email.service';
import { Deal } from '../Deals/deals.model'

export const NewsletterService = {
  sendDailyNewsletter: async () => {
    try {
      // Step 1: Fetch all users who are subscribed to the newsletter
      const newsletterSubscribers = await User.find({
        isSubscribedToNewsletter: true,
      }).select('newsLetterEmail name favorites favoriteCreditCardVendors');

      if (!newsletterSubscribers.length) {
        return;
      }

      // Step 2: Prepare and send the newsletter for each subscriber
      for (const subscriber of newsletterSubscribers) {
        const { favorites, favoriteCreditCardVendors, newsLetterEmail } = subscriber;

        // Use aggregation to fetch deals tailored to the user's favorites
        const personalizedDeals = await Deal.aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [
                    { companyId: { $in: favorites.map((fav: any) => new Types.ObjectId(fav)) } },
                    { vendorId: { $in: favoriteCreditCardVendors.map((fav: any) => new Types.ObjectId(fav)) } },
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
          .map(
            (deal: {
              percentage: any;
              link: any;
              type: string;
              companyDetails: { name: string };
            }) => {
              const dealType = deal.type === 'cashback' ? 'Cashback' : 'Credit Card';
              return `
                <h2>${dealType} Deal - ${deal.companyDetails.name}</h2>
                <ul>
                  <li><strong>Percentage:</strong> ${deal.percentage}%</li>
                  <li><a href="${deal.link}" target="_blank">View Deal</a></li>
                </ul>
              `;
            },
          )
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
          await EmailService.sendEmail(newsLetterEmail, subject, text, emailHtml);
          console.log(`Newsletter sent to ${newsLetterEmail}`);
        } catch (error) {
          console.error(
            `Failed to send email to ${newsLetterEmail}:`,
            (error as any).message,
          );
        }
      }
    } catch (error: any) {
      console.error('Error in sending daily newsletter:', error.message);
    }
  },
};

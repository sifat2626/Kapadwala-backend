import { User } from '../User/user.model';
import { DealServices } from '../Deals/deal.service';
import { EmailService } from '../../utils/email.service';

export const NewsletterService = {
  sendDailyNewsletter: async () => {
    // Step 1: Fetch top 10 deals
    const topDeals = await DealServices.getTopDeals();
    const top10Deals = topDeals.slice(0, 10); // Limit to 10 deals

    // Step 2: Fetch all authenticated users with active subscriptions
    const users = await User.find({ isSubscribed: true }).select('email name');
    if (!users.length) {
      console.log('No subscribed users found.');
      return;
    }

    // Step 3: Prepare the newsletter content
    const dealsHtml = top10Deals
      .map((deal) => {
        const cashback = deal.bestCashbackDeal
          ? `<li><strong>Cashback:</strong> ${deal.bestCashbackDeal.title} (${deal.bestCashbackDeal.percentage}% off)
              <br/> <a href="${deal.bestCashbackDeal.link}" target="_blank">View Cashback Deal</a>
            </li>`
          : '';

        const giftcard = deal.bestGiftcardDeal
          ? `<li><strong>Gift Card:</strong> ${deal.bestGiftcardDeal.title} (${deal.bestGiftcardDeal.percentage}% off)
              <br/> <a href="${deal.bestGiftcardDeal.link}" target="_blank">View Gift Card Deal</a>
            </li>`
          : '';

        const creditCards = deal.creditCardDeals.length
          ? deal.creditCardDeals
            .map(
              (creditDeal: { vendor: { name: any; };title:any; link: any; }) => `
                  <li><strong>Credit Card:</strong> ${creditDeal.vendor?.name || 'N/A'} - ${creditDeal.title}
                    <br/> <a href="${creditDeal.link}" target="_blank">View Credit Card Deal</a>
                  </li>`
            )
            .join('')
          : '<li>No active credit card deals</li>';

        return `
          <h2>${deal.company.name}</h2>
          <ul>
            ${cashback}
            ${giftcard}
            ${creditCards}
          </ul>
        `;
      })
      .join('');

    const emailHtml = `
      <h1>Top 10 Deals of the Day</h1>
      ${dealsHtml}
      <p>Thank you for subscribing to our newsletter!</p>
    `;

    // Step 4: Send emails to each user
    for (const user of users) {
      const subject = 'Your Daily Top Deals!';
      const text = 'Check out the top deals of the day!';
      try {
        await EmailService.sendEmail(user.email, subject, text, emailHtml);
        console.log(`Newsletter sent to ${user.email}`);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        console.error(`Failed to send email to ${user.email}:`, error.message);
      }
    }
  },
};

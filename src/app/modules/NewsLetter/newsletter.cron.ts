import cron from 'node-cron';
import { NewsletterService } from './newsletter.service';
import config from '../../config'

// Schedule the task to run daily at 8 AM
cron.schedule(`0 ${config.newslettre_hour} * * *`, async () => {
  console.log('Sending daily newsletter...');
  try {
    await NewsletterService.sendDailyNewsletter();
    console.log('Daily newsletter sent successfully.');
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    console.error('Failed to send daily newsletter:', error.message);
  }
});

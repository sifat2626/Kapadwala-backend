import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { NewsletterService } from './newsletter.service';

// Manually send the newsletter
const sendNewsletterManually: RequestHandler = catchAsync(async (req, res) => {
  await NewsletterService.sendDailyNewsletter();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Newsletter sent successfully.',
    data:''
  });
});

export const NewsletterController = {
  sendNewsletterManually,
};

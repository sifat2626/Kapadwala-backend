import { RequestHandler } from 'express';
import { EmailService } from '../../utils/email.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const sendWelcomeEmail: RequestHandler = catchAsync(async (req, res) => {
  const { email, name } = req.body;

  // Compose the email content
  const subject = 'Welcome to Our Platform!';
  const text = `Hi ${name},\n\nThank you for joining our platform. We're excited to have you onboard!`;
  const html = `<p>Hi <strong>${name}</strong>,</p><p>Thank you for joining our platform. We're excited to have you on board!</p>`;

  // Send the email
  await EmailService.sendEmail(email, subject, text, html);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Welcome email sent successfully.',
    data:''
  });
});

export const EmailController = {
  sendWelcomeEmail,
};

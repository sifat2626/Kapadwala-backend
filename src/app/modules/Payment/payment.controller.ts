import { RequestHandler } from 'express';
import Stripe from 'stripe';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import config from '../../config';
import { PaymentService } from './payment.service';

// Create a Stripe payment session
const createPaymentSession: RequestHandler = catchAsync(async (req, res) => {
  const { amount, currency } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'You must be logged in to create a payment session.',
      data: null,
    });
  }

  const session = await PaymentService.createPaymentSession(userId, amount, currency);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment session created successfully.',
    data: session,
  });
});

// Handle Stripe webhook
const stripeWebhook: RequestHandler = catchAsync(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Missing Stripe signature header.',
      data: null,
    });
  }

  const stripe = new Stripe(config.stripe_secret_key as string, {
    apiVersion: '2024-11-20.acacia',
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Raw body
      sig,
      config.stripe_webhook_secret as string // Webhook secret
    );
    console.log(`Webhook Verified: ${event.type}`);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `Webhook signature verification failed: ${(error as Error).message}`,
      data: null,
    });
  }

  await PaymentService.handleStripeWebhook(event);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Webhook processed successfully.',
    data: { received: true },
  });
});

export const PaymentController = {
  createPaymentSession,
  stripeWebhook,
};

import { RequestHandler } from 'express';
import Stripe from 'stripe';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import config from '../../config';
import { PaymentService } from './payment.service';


const createPayment = async (req: Request, res: Response) => {
  const stripe = new Stripe(config.stripe_secret_key as string, { apiVersion: '2024-11-20.acacia' });

  const {currency,amount} = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: 'Product Name' },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${config.client_url}/success`,
    cancel_url: `${config.client_url}/cancel`,
  });


  console.log(session);
  res.status(200).json({
    message: 'Create new payment',
  })
}


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

  try {
    await PaymentService.handleStripeWebhook(event);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Webhook processed successfully.',
      data: { received: true },
    });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);

    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'An error occurred while processing the webhook.',
      data: null,
    });
  }
});

export const PaymentController = {
  createPayment,
  stripeWebhook,
};

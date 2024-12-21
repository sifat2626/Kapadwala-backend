import { RequestHandler, Request, Response } from 'express';
import Stripe from 'stripe';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import config from '../../config';
import { PaymentService } from './payment.service';
import { User } from '../User/user.model'

// Create a Stripe payment session
const createPayment: RequestHandler = async (req, res) => {
  try {
    const stripe = new Stripe(config.stripe_secret_key as string, {
      apiVersion: '2024-11-20.acacia',
    });

    // Step 1: Extract user ID from authentication middleware
    const userId = req.user._id; // Assuming `req.user` is populated by authentication middleware
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required to create a subscription.',
      });
    }

    // Step 2: Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Step 3: Create or retrieve the Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
        });
        stripeCustomerId = customer.id;

        // Save the Stripe customer ID in the user record
        user.stripeCustomerId = stripeCustomerId;
        await user.save();
      } catch (error) {
        console.error('Error creating Stripe customer:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to create Stripe customer.',
        });
      }
    }

    // Step 4: Create a Stripe Checkout session
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], // Accept card payments
        customer: stripeCustomerId,
        line_items: [
          {
            price: config.stripe_price_id, // Replace with your Stripe price ID
            quantity: 1,
          },
        ],
        mode: 'subscription', // Ensure the mode is set to 'subscription'
        success_url: `${config.client_url}/success?session_id={CHECKOUT_SESSION_ID}`, // Redirect on success
        cancel_url: `${config.client_url}/cancel`, // Redirect on cancellation
      });
    } catch (error) {
      console.error('Error creating Stripe Checkout session:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create Stripe Checkout session.',
      });
    }

    // Step 5: Return the session URL to the client
    res.status(200).json({
      success: true,
      message: 'Checkout session created successfully.',
      data: {
        url: session.url, // Stripe-hosted payment page URL
      },
    });
  } catch (error) {
    console.error('Error in createPayment function:', error);
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred while creating the subscription.',
    });
  }
};

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

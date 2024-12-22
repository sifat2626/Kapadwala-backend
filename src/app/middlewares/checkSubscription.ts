import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { User } from '../modules/User/user.model';
import catchAsync from '../utils/catchAsync';

const checkSubscription = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id; // Assuming the user ID is stored in req.user after token validation

    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // Check if the subscription has expired
    const currentDate = new Date();
    if (user.expiresAt && currentDate > user.expiresAt) {
      // Update the user's subscription status if expired
      user.isSubscribed = false;
      await user.save();

      throw new AppError(
        httpStatus.FORBIDDEN,
        'Your subscription has expired. Please renew to access this resource!'
      );
    }

    // Allow access if the subscription is not expired
    if (user.expiresAt && currentDate <= user.expiresAt) {
      return next(); // Grant access if still within the subscription period
    }

    // If no valid expiration date exists, block access
    throw new AppError(httpStatus.FORBIDDEN, 'You must be subscribed to access this resource!');
  });
};

export default checkSubscription;

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

    // Check if the user exists and is subscribed
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    req.user.isSubscribed = user.isSubscribed;

    // Proceed to the next middleware or controller
    next();
  });
};

export default checkSubscription;

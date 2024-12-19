import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

// Create a new user
const createUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully.',
    data: result,
  });
});

// Get all users with query parameters for filtering
const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully.',
    meta: result.meta,
    data: result.result,
  });
});

// Get the currently logged-in user's information
const getMe: RequestHandler = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await UserServices.getMe(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully.',
    data: result,
  });
});

// Update a user's role
const updateUserRole: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.updateUserRoleIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User role updated successfully.',
    data: result,
  });
});

// Delete a user
const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.deleteUserIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully.',
    data: result,
  });
});

// Subscribe a user
const subscribeUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.subscribeUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User subscribed successfully.',
    data: result,
  });
});

const addFavoriteCompany: RequestHandler = catchAsync(async (req, res) => {
  const  userId  = req.user._id;
  const { companyId } = req.params;

  console.log(userId,companyId);

  const user = await UserServices.addFavoriteCompany(userId, companyId);

  // Add a null check to ensure user is valid
  if (!user) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'User not found.',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company added to favorites successfully.',
    data: user.favorites,
  });
});


const removeFavoriteCompany: RequestHandler = catchAsync(async (req, res) => {
  const  userId  = req.user._id;
  const { companyId } = req.params;

  const user = await UserServices.removeFavoriteCompany(userId, companyId);

  // Add a null check
  if (!user) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'User not found.',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company removed from favorites successfully.',
    data: user.favorites,
  });
});

const getAllFavoriteCompanies: RequestHandler = catchAsync(async (req, res) => {
  const userId  = req.user._id;

  const user = await UserServices.getAllFavoriteCompanies(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favorite companies retrieved successfully.',
    data: user?.favorites,
  });
});




export const UserControllers = {
  createUser,
  getAllUsers,
  getMe,
  updateUserRole,
  deleteUser,
  subscribeUser,
  addFavoriteCompany,
  removeFavoriteCompany,
  getAllFavoriteCompanies
};

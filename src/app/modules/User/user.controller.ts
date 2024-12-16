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

export const UserControllers = {
  createUser,
  getAllUsers,
  getMe,
  updateUserRole,
  deleteUser,
  subscribeUser,
};

import { RequestHandler } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { UserServices } from './user.service'

// Create a new user
const createUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully.',
    data: result,
  })
})

// Get all users with query parameters for filtering
const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully.',
    meta: result.meta, // Include meta information
    data: result.result,
  })
})

// Get the currently logged-in user's information
const getMe: RequestHandler = catchAsync(async (req, res) => {
  const { email } = req.user

  const result = await UserServices.getMe(email)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully.',
    data: result,
  })
})

// Update a user's role
const updateUserRole: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params

  const result = await UserServices.updateUserRoleIntoDB(id, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User role updated successfully.',
    data: result,
  })
})

// Delete a user
const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params

  const result = await UserServices.deleteUserIntoDB(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully.',
    data: result,
  })
})

// Subscribe a user
const subscribeUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params

  const result = await UserServices.subscribeUser(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User subscribed successfully.',
    data: result,
  })
})

// Add a company to the user's favorites
const addFavoriteCompany: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user._id
  const { companyId } = req.params

  const user = await UserServices.addFavoriteCompany(userId, companyId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company added to favorites successfully.',
    data: user?.favorites || [],
  })
})

// Add a credit card vendor to the user's favorites
const addFavoriteCreditCardVendor: RequestHandler = catchAsync(
  async (req, res) => {
    const userId = req.user._id
    const { vendorId } = req.params

    const user = await UserServices.addFavoriteCreditCardVendor(
      userId,
      vendorId,
    )

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Vendor added to favorites successfully.',
      data: user?.favoriteCreditCardVendors || [],
    })
  },
)

// Remove a company from the user's favorites
const removeFavoriteCompany: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user._id
  const { companyId } = req.params

  const user = await UserServices.removeFavoriteCompany(userId, companyId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company removed from favorites successfully.',
    data: user?.favorites || [],
  })
})

// Remove a credit card vendor from the user's favorites
const removeFavoriteCreditCardVendor: RequestHandler = catchAsync(
  async (req, res) => {
    const userId = req.user._id
    const { vendorId } = req.params

    const user = await UserServices.removeFavoriteCreditCardVendor(
      userId,
      vendorId,
    )

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Vendor removed from favorites successfully.',
      data: user?.favoriteCreditCardVendors || [],
    })
  },
)

// Get all favorite companies for the logged-in user
const getAllFavoriteCompanies: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user._id

  const result = await UserServices.getAllFavoriteCompanies(userId, req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favorite companies retrieved successfully.',
    meta: result.meta,
    data: result.data,
  })
})

// Get all favorite credit card vendors for the logged-in user
const getAllFavoriteCreditCardVendors: RequestHandler = catchAsync(
  async (req, res) => {
    const userId = req.user._id

    const result = await UserServices.getAllFavoriteCreditCardVendors(
      userId,
      req.query,
    )

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Favorite credit card vendors retrieved successfully.',
      meta: result.meta,
      data: result.data,
    })
  },
)

export const UserControllers = {
  createUser,
  getAllUsers,
  getMe,
  updateUserRole,
  deleteUser,
  subscribeUser,
  addFavoriteCompany,
  removeFavoriteCompany,
  getAllFavoriteCompanies,
  addFavoriteCreditCardVendor,
  removeFavoriteCreditCardVendor,
  getAllFavoriteCreditCardVendors,
}

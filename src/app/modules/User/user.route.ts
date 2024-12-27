import express from 'express'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { USER_ROLE } from './user.constant'
import { UserControllers } from './user.controller'
import { UserValidation } from './user.validation'
import protect from '../../middlewares/protect'

const router = express.Router()

// Route for creating a new user
router.post(
  '/create',
  validateRequest(UserValidation.userValidationSchema),
  UserControllers.createUser,
)

// Route for changing a user's role
router.patch(
  '/:id/change-role',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(UserValidation.updateUserRoleValidationSchema),
  UserControllers.updateUserRole,
)

// Route for deleting a user
router.delete(
  '/:id/delete',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserControllers.deleteUser,
)

// Route for subscribing a user
router.patch(
  '/:id/subscribe',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserControllers.subscribeUser,
)

// Route to add a favorite company
router.post(
  '/favorites/:companyId/add',
  protect(),
  UserControllers.addFavoriteCompany,
)

// Route to remove a favorite company
router.delete(
  '/favorites/:companyId/remove',
  protect(),
  UserControllers.removeFavoriteCompany,
)

// Route to get all favorite companies
router.get('/favorites', protect(), UserControllers.getAllFavoriteCompanies)

// Route to add a favorite credit card vendor
router.post(
  '/favorites/vendor/:vendorId/add',
  protect(),
  UserControllers.addFavoriteCreditCardVendor,
)

// Route to remove a favorite credit card vendor
router.delete(
  '/favorites/vendor/:vendorId/remove',
  protect(),
  UserControllers.removeFavoriteCreditCardVendor,
)

// Route to get the currently logged-in user's information
router.get('/me', protect(), UserControllers.getMe)

// Route to get all users (admin and super admin access only)
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserControllers.getAllUsers,
)

// Route to get all favorite credit card vendors
router.get(
  '/favorites/vendors',
  protect(),
  UserControllers.getAllFavoriteCreditCardVendors,
)

export const UserRoutes = router

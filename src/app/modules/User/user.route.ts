import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.validation';
import protect from '../../middlewares/protect'

const router = express.Router();

// Route for creating a new user
router.post(
  '/create-user',
  // auth(USER_ROLE.admin),
  validateRequest(UserValidation.userValidationSchema),
  UserControllers.createUser,
);

// Route for changing a user's role
router.patch(
  '/change-role/:id',
  auth(USER_ROLE.admin,USER_ROLE.superAdmin),
  validateRequest(UserValidation.updateUserRoleValidationSchema),
  UserControllers.updateUserRole,
);

// Route for deleting a user
router.delete(
  '/delete-user/:id',
  auth(USER_ROLE.admin,USER_ROLE.superAdmin),
  UserControllers.deleteUser,
);

// Route for subscribing a user
router.patch(
  '/subscribe/:id',
  auth(USER_ROLE.admin,USER_ROLE.superAdmin),
  UserControllers.subscribeUser,
);

// Route to add a favorite company
router.post('/:companyId/favorites',protect(), UserControllers.addFavoriteCompany);

// Route to remove a favorite company
router.delete('/:companyId/favorites',protect(), UserControllers.removeFavoriteCompany);

router.get('/favorites', protect(), UserControllers.getAllFavoriteCompanies);

router.get('/me', protect(), UserControllers.getMe);

export const UserRoutes = router;

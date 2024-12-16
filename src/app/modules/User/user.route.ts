import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.validation';

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
  auth(USER_ROLE.admin),
  validateRequest(UserValidation.updateUserRoleValidationSchema),
  UserControllers.updateUserRole,
);

// Route for deleting a user
router.delete(
  '/delete-user/:id',
  auth(USER_ROLE.admin),
  UserControllers.deleteUser,
);

// Route for subscribing a user
router.patch(
  '/subscribe/:id',
  auth(USER_ROLE.admin),
  UserControllers.subscribeUser,
);

export const UserRoutes = router;

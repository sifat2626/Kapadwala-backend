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

// Route to add a favorite company
router.post('/:companyId/favorites',auth(USER_ROLE.user,USER_ROLE.admin,USER_ROLE.superAdmin), UserControllers.addFavoriteCompany);

// Route to remove a favorite company
router.delete('/:companyId/favorites',auth(USER_ROLE.user,USER_ROLE.admin,USER_ROLE.superAdmin), UserControllers.removeFavoriteCompany);

router.get('/favorites', auth(USER_ROLE.user,USER_ROLE.admin,USER_ROLE.superAdmin), UserControllers.getAllFavoriteCompanies);

export const UserRoutes = router;

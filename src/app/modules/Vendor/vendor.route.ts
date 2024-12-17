import { Router } from 'express';
import { VendorController } from './vendor.controller';
import validateRequest from '../../middlewares/validateRequest';
import { VendorValidation } from './vendor.validation';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth'

const router = Router();

router.post(
  '/',
  validateRequest(VendorValidation.createVendor),
  auth(USER_ROLE.admin),
  VendorController.createVendor
)

router.get('/', VendorController.getAllVendors);

router.get('/:id', VendorController.getVendorById);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(VendorValidation.updateVendor),
  VendorController.updateVendor,
);

router.delete('/:id',  auth(USER_ROLE.admin), VendorController.deleteVendor);

export const VendorRoutes = router;

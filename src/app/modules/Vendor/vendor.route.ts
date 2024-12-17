import { Router } from 'express';
import { VendorController } from './vendor.controller';
import validateRequest from '../../middlewares/validateRequest';
import { VendorValidation } from './vendor.validation';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth'
import protect from '../../middlewares/protect'

const router = Router();

router.post(
  '/',
  validateRequest(VendorValidation.createVendor),
  auth(USER_ROLE.admin,USER_ROLE.superAdmin),
  VendorController.createVendor
)

router.get('/',protect(), VendorController.getAllVendors);

router.get('/:id',protect(), VendorController.getVendorById);

router.get('/deals/:vendorName',protect(), VendorController.getDealsByVendorName);

router.patch(
  '/:id',
  auth(USER_ROLE.admin,USER_ROLE.superAdmin),
  validateRequest(VendorValidation.updateVendor),
  VendorController.updateVendor,
);

router.delete('/:id',  auth(USER_ROLE.admin,USER_ROLE.superAdmin), VendorController.deleteVendor);

export const VendorRoutes = router;

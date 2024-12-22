import { Router } from 'express';
import { VendorController } from './vendor.controller';
import validateRequest from '../../middlewares/validateRequest';
import { VendorValidation } from './vendor.validation';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth'
import protect from '../../middlewares/protect'
import { upload } from '../../utils/upload'

const router = Router();

router.post(
  '/',
  validateRequest(VendorValidation.createVendor),
  auth(USER_ROLE.admin,USER_ROLE.superAdmin),
  VendorController.createVendor
)

router.post(
  '/upload-csv',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single('file'), // Handle single file upload with the key 'file'
  VendorController.uploadVendorsFromCSV,
);

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

import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { DealControllers } from './deal.controller';
import { upload } from '../../utils/upload'
import protect from '../../middlewares/protect'

const router = express.Router();

// Route for uploading a CSV to create/update deals
router.post(
  '/upload-csv',
  auth(USER_ROLE.admin,USER_ROLE.superAdmin), // Only admins can upload CSV files
  upload.single('file'), // Accepts a single file with the key 'file'
  DealControllers.uploadDealsFromCSV,
);

router.get('/active',protect(), DealControllers.getAllActiveDeals);

router.get('/cashback-rate/:companyName',protect(), DealControllers.getBestCashbackRateByCompany);

router.get('/giftcard-rate/:companyName',protect(), DealControllers.getBestGiftcardRateByCompany);

router.get('/creditcard/expiring-soon/:vendorName',protect(), DealControllers.getExpiringCreditcardDealsByVendor);

router.get('/giftcard/active',protect(), DealControllers.getActiveGiftcardDeals);

router.get('/cashback/active',protect(), DealControllers.getActiveCashbackDeals);

router.get('/creditcard/active',protect(), DealControllers.getActiveCreditcardDeals);

// Get all deals
router.get(
  '/',
  protect(),
  DealControllers.getAllDeals,
);

// Get top deals
router.get(
  '/top',
  protect(),
  DealControllers.getTopDeals,
);

// Delete Old Deals
router.delete(
  '/delete-old-deals',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin), // Only admins or super admins can delete old deals
  DealControllers.deleteOldDeals,
);

export const DealRoutes = router;

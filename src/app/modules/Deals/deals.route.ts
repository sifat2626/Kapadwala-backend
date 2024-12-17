import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { DealControllers } from './deal.controller';
import { upload } from '../../utils/upload'

const router = express.Router();

// Route for uploading a CSV to create/update deals
router.post(
  '/upload-csv',
  auth(USER_ROLE.admin), // Only admins can upload CSV files
  upload.single('file'), // Accepts a single file with the key 'file'
  DealControllers.uploadDealsFromCSV,
);

router.get('/active', DealControllers.getAllActiveDeals);

router.get('/cashback-rate/:companyName', DealControllers.getBestCashbackRateByCompany);

router.get('/giftcard-rate/:companyName', DealControllers.getBestGiftcardRateByCompany);

router.get('/creditcard/expiring-soon/:vendorName', DealControllers.getExpiringCreditcardDealsByVendor);

router.get('/giftcard/active', DealControllers.getActiveGiftcardDeals);

router.get('/cashback/active', DealControllers.getActiveCashbackDeals);

router.get('/creditcard/active', DealControllers.getActiveCreditcardDeals);

// Get all deals
router.get(
  '/',
  auth(USER_ROLE.user,USER_ROLE.admin), // Authenticated users can access deals
  DealControllers.getAllDeals,
);

// Get top deals
router.get(
  '/top',
  auth(USER_ROLE.user,USER_ROLE.admin), // Authenticated users can access top deals
  DealControllers.getTopDeals,
);

export const DealRoutes = router;

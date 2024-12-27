import express from 'express'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.constant'
import { DealControllers } from './deal.controller'
import { upload } from '../../utils/upload'
import protect from '../../middlewares/protect'
import limitUnSubscribedUser from '../../middlewares/limitUnSubscribedUser'
import checkSubscription from '../../middlewares/checkSubscription'

const router = express.Router()

// Route for uploading a CSV to create/update deals
router.post(
  '/upload-csv',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin), // Only admins can upload CSV files
  upload.single('file'), // Accepts a single file with the key 'file'
  DealControllers.uploadDealsFromCSV,
)

router.get(
  '/active',
  protect(),
  limitUnSubscribedUser(),
  DealControllers.getAllActiveDeals,
)

router.get(
  '/cashback-rate/:companyName',
  protect(),
  checkSubscription(),
  DealControllers.getBestCashbackRateByCompany,
)

router.get(
  '/giftcard-rate/:companyName',
  protect(),
  DealControllers.getBestGiftcardRateByCompany,
)

router.get(
  '/creditcard/expiring-soon/:vendorName',
  protect(),
  DealControllers.getExpiringCreditcardDealsByVendor,
)

router.get(
  '/giftcard/active',
  protect(),
  DealControllers.getActiveGiftcardDeals,
)

router.get(
  '/cashback/active',
  protect(),
  DealControllers.getActiveCashbackDeals,
)

router.get(
  '/creditcard/active',
  protect(),
  DealControllers.getActiveCreditcardDeals,
)

router.get('/creditcard/all', protect(), DealControllers.getAllCreditcardDeals)

// Get all deals
router.get(
  '/',
  protect(),
  // limitUnSubscribedUser(),
  DealControllers.getAllDeals,
)

// Get top deals
router.get('/top', protect(), DealControllers.getTopDeals)

// Delete Old Deals
router.delete(
  '/delete-old-deals',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin), // Only admins or super admins can delete old deals
  DealControllers.deleteOldDeals,
)

// Route to get top deals from user's favorite companies
router.get(
  '/favorites/top-deals',
  protect(),
  DealControllers.getTopDealsFromFavorites,
)

export const DealRoutes = router

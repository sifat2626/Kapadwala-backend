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

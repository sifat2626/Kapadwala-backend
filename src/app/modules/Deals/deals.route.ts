import express from 'express';
import multer from 'multer';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant'
import { DealControllers } from './deal.controller'

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be stored in 'uploads/' temporarily

// Route for uploading a CSV to create/update deals
router.post(
  '/upload-csv',
  auth(USER_ROLE.admin), // Only admins can upload CSV files
  upload.single('file'), // Accepts a single file with the key 'file'
  DealControllers.uploadDealsFromCSV,
);

// Get all deals
router.get(
  '/',
  auth(USER_ROLE.user), // Authenticated users can access deals
  DealControllers.getAllDeals,
);

// Get top deals
router.get(
  '/top',
  auth(USER_ROLE.user), // Authenticated users can access top deals
  DealControllers.getTopDeals,
);

export const DealRoutes = router;

import multer from 'multer';

// Configure in-memory storage
const storage = multer.memoryStorage();

console.log('in middleware')

// File filter to validate CSV files
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const fileFilter = (req, file, cb) => {

  if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {

    cb(null, true); // Accept file

  } else {
    cb(new Error('Only CSV files are allowed'), false); // Reject file
  }
};

// Set upload limits (optional)
const limits = {
  fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits,
});

export { upload };

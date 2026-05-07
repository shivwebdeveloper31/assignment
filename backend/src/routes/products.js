const express = require('express');
const multer = require('multer');
const router = express.Router();
const ctrl = require('../controllers/productsController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'application/csv',
      'application/octet-stream'
    ];
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (allowed.includes(file.mimetype) || ['xlsx', 'xls', 'csv'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'));
    }
  }
});

// Import
router.post('/import', upload.single('file'), ctrl.importProducts);

// Products CRUD / list
router.get('/', ctrl.getProducts);
router.get('/categories', ctrl.getCategories);
router.get('/:productId/reviews', ctrl.getProductReviews);

// Analytics
router.get('/analytics/summary', ctrl.getSummaryStats);
router.get('/analytics/products-per-category', ctrl.getProductsPerCategory);
router.get('/analytics/top-reviewed', ctrl.getTopReviewedProducts);
router.get('/analytics/discount-distribution', ctrl.getDiscountDistribution);
router.get('/analytics/category-avg-rating', ctrl.getCategoryAvgRating);

module.exports = router;

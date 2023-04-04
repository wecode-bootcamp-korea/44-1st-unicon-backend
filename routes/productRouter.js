const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
//const validateToken = require('../middleware/auth')

router.get('/:productId', productController.getProductByProductId);
router.get('/:productId/detail', productController.getDetailByProductId);

module.exports = {
  router,
};

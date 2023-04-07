const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router.get('/product/:productId', productController.getProductById);
router.get('/lists', productController.getProductList);

module.exports = {
  router,
};

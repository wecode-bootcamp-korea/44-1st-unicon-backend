const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router.get('product/:productId', productController.getProductById);
router.get('detail/:productId', productController.getDetailByProductId);
router.get('/lists', productController.getAllproduct);
router.get('/category', productController.categoryPage);

module.exports = {
  router,
};

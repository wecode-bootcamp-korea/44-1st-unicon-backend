const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
//const validateToken = require('../middleware/auth')

router.get('product/:productId', productController.getProductByProductId);
router.get('detail/:productId', productController.getDetailByProductId);
router.get('/lists', productController.getAllproduct);
module.exports = {
  router,
};

const express = requrie('express');
const productController = require('../controllers/productController');
const router = express.Router();
//const validateToken = require('../middleware/auth')

router.get('/:productId', productController.getProductByProductId);

module.exports = {
  router,
};

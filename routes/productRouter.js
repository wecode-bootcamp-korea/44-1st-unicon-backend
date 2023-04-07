const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router.get('/product/:productId', productController.getProductById);

module.exports = router;

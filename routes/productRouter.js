const express = requrie('express');
const productController = require('../controller/productController');
const router = express.Router();
//const validateToken = require('../middleware/auth')

router.get('/:productId', productController.getProductByProductId);

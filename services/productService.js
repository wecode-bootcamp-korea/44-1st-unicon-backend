const productDao = require('../models/productDao');

const getProductById = async (productId) => {
  return await productDao.getProductById(productId);
};

module.exports = { getProductById, getDetailByProductId };

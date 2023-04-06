const productDao = require('../models/productDao');

const getProductById = async (productId) => {
  return await productDao.getProductById(productId);
};

const getDetailByProductId = async (productId) => {
  return productDao.getDetailByProductId(productId);
};
module.exports = { getProductById, getDetailByProductId };

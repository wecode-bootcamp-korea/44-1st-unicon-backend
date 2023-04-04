const productDao = require('../models/productDao');

const getProductByProductId = async (productId) => {
  return productDao.getProductByProductId(productId);
};

const getDetailByProductId = async (productId) => {
  return productDao.getDetailByProductId(productId);
};
module.exports = { getProductByProductId, getDetailByProductId };

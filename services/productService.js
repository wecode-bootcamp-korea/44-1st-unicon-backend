const productDao = require('../models/productDao');

const getProductByProductId = async (productId) => {
  return productDao.getProductByProductId(productId);
};
module.exports = { getProductByProductId };

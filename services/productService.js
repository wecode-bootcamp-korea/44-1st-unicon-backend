const productDao = require('../models/productDao');

const getProductById = async (productId) => {
  return productDao.getProductById(productId);
};

const categoryPage = async (mc, sc, pf) => {
  return await productDao.categoryPage(mc, sc, pf);
};

module.exports = {
  getProductById,
  categoryPage,
};

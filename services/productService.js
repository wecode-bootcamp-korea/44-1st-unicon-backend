const productDao = require('../models/productDao');

const getProductById = async (productId) => {
  return productDao.getProductById(productId);
};

const categoryPage = async (mc, sc, pf, start, count, isnew) => {
  return await productDao.categoryPage(mc, sc, pf, start, count, isnew);
};

module.exports = {
  getProductById,
  categoryPage,
};

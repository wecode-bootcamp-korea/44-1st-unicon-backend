const productDao = require('../models/productDao');

const getProductById = async (productId) => {
  return productDao.getProductById(productId);
};

const getAllproduct = async () => {
  return await productDao.getAllproduct();
};

const getAllproductOrder = async (filter) => {
  return await productDao.getAllproductOrder(filter);
};

const categoryPage = async (mc, sc, pf) => {
  return await productDao.categoryPage(mc, sc, pf);
};

module.exports = {
  getProductById,
  getAllproduct,
  getAllproductOrder,
  categoryPage,
};

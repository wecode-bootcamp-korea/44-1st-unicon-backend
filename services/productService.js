const productDao = require('../models/productDao');

const getProductById = async (productId, mainCategory) => {
  if (mainCategory == 3) {
    const product = await productDao.getProductById(productId);
    const subProduct = await productDao.getProductById(2);
    return { product: product, subProduct: subProduct };
  }
  return productDao.getProductById(productId);
};

const getDetailByProductId = async (productId) => {
  return await productDao.getDetailByProductId(productId);
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
  getDetailByProductId,
  getAllproduct,
  getAllproductOrder,
  categoryPage,
};

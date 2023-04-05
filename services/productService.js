const productDao = require('../models/productDao');

const getProductById = async (productId, mainCategory) => {
  if (mainCategory == 3) {
    const product = await productDao.getProductById(productId);
    const subProduct = await productDao.getProductByProductId(2);

    return { product: product, subProduct: subProduct };
  }
  return productDao.getProductByProductId(productId, mainCategory);
};

const getDetailByProductId = async (productId) => {
  return await productDao.getDetailByProductId(productId);
};

const getAllproduct = async () => {
  return await productDao.getAllproduct();
};

const getAllproductOrder = async (filter) => {
  return await productDao.getAllproduct(filter);
};

const categoryPage = async (mc, sc, filter) => {
  return await productDao.categoryPage(mc, sc, filter);
};

module.exports = {
  getProductById,
  getDetailByProductId,
  getAllproduct,
  getAllproductOrder,
  categoryPage,
};

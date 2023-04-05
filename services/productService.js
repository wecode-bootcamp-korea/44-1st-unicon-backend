const productDao = require('../models/productDao');

const getProductByProductId = async (productId, main_category) => {
  if (main_category == 3) {
    const product = await productDao.getProductByProductId(productId);
    const subProduct = await productDao.getProductByProductId(2);

    return { product: product, subProduct: subProduct };
  }
  return productDao.getProductByProductId(productId, main_category);
};

const getDetailByProductId = async (productId) => {
  return productDao.getDetailByProductId(productId);
};
module.exports = { getProductByProductId, getDetailByProductId };

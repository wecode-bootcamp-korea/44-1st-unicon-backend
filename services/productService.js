const productDao = require('../models/productDao');

const getShowRoom = async () => {
  return await productDao.getShowRoom();
};

const getProductById = async (productId) => {
  return await productDao.getProductById(productId);
};

const getProductList = async (
  mainCategory,
  subCategory,
  pricefilter,
  start,
  limit,
  isnew
) => {
  return await productDao.getProductList(
    mainCategory,
    subCategory,
    pricefilter,
    start,
    limit,
    isnew
  );
};

module.exports = {
  getProductById,
  getProductList,
  getShowRoom,
};

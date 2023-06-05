const productDao = require('../models/productDao');

const searchProduct = async (word) => {
  return await productDao.searchProduct(word);
};
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
  offset,
  limit,
  isnew
) => {
  return await productDao.getProductList(
    mainCategory,
    subCategory,
    pricefilter,
    offset,
    limit,
    isnew
  );
};

module.exports = {
  getProductById,
  getProductList,
  getShowRoom,
  searchProduct,
};

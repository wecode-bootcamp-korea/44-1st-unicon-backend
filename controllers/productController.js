const productService = require('../services/productService');
const { catchError, baseError } = require('../middlewares/error');

const getProductById = catchError(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return new baseError('PRODUCT_DOES_NOT_EXIST', 404);
  }

  const [product] = await productService.getProductById(productId);

  return res.status(200).json(product);
});

const getProductList = catchError(async (req, res) => {
  const {
    mainCategory,
    subCategory,
    pricefilter,
    start = 15,
    limit = 0,
    isnew,
  } = req.query;

  const category = await productService.getProductList(
    parseInt(mainCategory),
    parseInt(subCategory),
    pricefilter,
    start,
    limit,
    isnew
  );
  return res.status(200).json(category);
});

module.exports = {
  getProductById,
  getProductList,
};

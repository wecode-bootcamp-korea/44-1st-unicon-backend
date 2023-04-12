const productService = require('../services/productService');
const { catchError, baseError } = require('../middlewares/error');

const searchProduct = catchError(async (req, res) => {
  const { word } = req.body;
  const serchProduct = await productService.searchProduct(word);

  return res.status(200).json(serchProduct);
});

const getShowRoom = catchError(async (req, res) => {
  const showRoomProduct = await productService.getShowRoom();
  return res.status(200).json(showRoomProduct);
});

const getProductById = catchError(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return new baseError('PRODUCT_DOES_NOT_EXIST', 404);
  }

  const [product] = await productService.getProductById(productId);

  return res.status(200).json(product);
});

const getProductList = catchError(async (req, res) => {
  const DEFAULT_LIMIT = 15;
  const DEFAULT_OFFSET = 0;

  const {
    mainCategory,
    subCategory,
    pricefilter,
    offset = DEFAULT_OFFSET,
    limit = DEFAULT_LIMIT,
    isnew,
  } = req.query;

  const category = await productService.getProductList(
    parseInt(mainCategory),
    parseInt(subCategory),
    pricefilter,
    offset,
    limit,
    isnew
  );

  return res.status(200).json(category);
});

module.exports = {
  getProductById,
  getProductList,
  getShowRoom,
  searchProduct,
};

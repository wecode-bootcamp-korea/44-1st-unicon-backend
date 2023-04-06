const productService = require('../services/productService');
const { catchError, baseError } = require('../middlewares/error');

const getProductById = catchError(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return new baseError('NOT_PRODUCTID', 400);
  }
  const [product] = await productService.getProductById(productId);
  return res.status(200).json(product);
});

const categoryPage = catchError(async (req, res) => {
  const { mc, sc, pf, start = 0, count = 15, isnew } = req.query;
  const category = await productService.categoryPage(
    mc,
    sc,
    pf,
    start,
    count,
    isnew
  );
  return res.status(200).json(category);
});

module.exports = {
  getProductById,
  categoryPage,
};

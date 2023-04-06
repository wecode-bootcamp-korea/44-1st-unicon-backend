const productService = require('../services/productService');
const { catchError } = require('../middlewares/error');

const getProductById = catchError(async (req, res) => {
  const { productId } = req.params;
  const [product] = await productService.getProductById(productId);

  return res.status(200).json(product);
});

const categoryPage = catchError(async (req, res) => {
  const { mc, sc, pf, start = 0, count = 15 } = req.query;
  const category = await productService.categoryPage(mc, sc, pf, start, count);
  return res.status(200).json(category);
});

module.exports = {
  getProductById,
  categoryPage,
};

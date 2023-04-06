const productService = require('../services/productService');
const { catchError } = require('../middlewares/error');

const getProductById = catchError(async (req, res) => {
  const { productId } = req.params;
  const { mainCategory } = req.body;
  const product = await productService.getProductById(productId, mainCategory);
  return res.status(200).json(product);
});

const getDetailByProductId = catchError(async (req, res) => {
  const { productId } = req.params;
  const detail = await productService.getDetailByProductId(productId);
  return res.status(200).json(detail);
});

module.exports = {
  getProductById,
  getDetailByProductId,
};

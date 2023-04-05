const productService = require('../services/productService');
const { catchError } = require('../middlewares/error');

const getProductByProductId = catchError(async (req, res) => {
  const { productId } = req.params;
  const { main_category } = req.body;
  const product = await productService.getProductByProductId(
    productId,
    main_category
  );
  return res.status(200).json({ product });
});

const getDetailByProductId = catchError(async (req, res) => {
  const { productId } = req.params;
  const detail = await productService.getDetailByProductId(productId);
  return res.status(200).json({ detail });
});

module.exports = {
  getProductByProductId,
  getDetailByProductId,
};

const productService = require('../services/productService');
const { catchErr } = require('../middleware/error');

const getProductByProductId = catchErr(async (req, res) => {
  const { productId, smallCategory } = req.body;
  const product = await productService.getProductByProductId(productId);
  return res.status(200).json({ product });
});

module.exports = {
  getProductByProductId,
};

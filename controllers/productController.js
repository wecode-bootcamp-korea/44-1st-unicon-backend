const productService = require('../services/productService');
const { catchError } = require('../middlewares/error');

const getProductByProductId = catchError(async (req, res) => {
  const { productId } = req.params;
  const { main_category } = req.query;
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

const getAllproduct = catchError(async (req, res) => {
  const productsList = await productService.getAllproduct();
  return res.status(200).json({ productsList });
});
module.exports = {
  getProductByProductId,
  getDetailByProductId,
  getAllproduct,
};

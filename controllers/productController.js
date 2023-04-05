const productService = require('../services/productService');
const { catchError } = require('../middlewares/error');

const getProductById = catchError(async (req, res) => {
  const { productId } = req.params;
  const { mainCategory } = req.query;
  const product = await productService.getProductById(productId, mainCategory);
  return res.status(200).json({ product });
});

const getDetailByProductId = catchError(async (req, res) => {
  const { productId } = req.params;
  const detail = await productService.getDetailByProductId(productId);
  return res.status(200).json({ detail });
});

const getAllproduct = catchError(async (req, res) => {
  const { filter } = req.query;
  if (filter) {
    const productsListFilter = await productService.getAllproductOrder(filter);
    return res.status(200).json({ productsListFilter });
  }
  const productsList = await productService.getAllproduct();
  return res.status(200).json({ productsList });
});

const categoryPage = catchError(async (req, res) => {
  const { mc, sc, filter } = req.query;
  const category = await productService.categoryPage(mc, sc, filter);
  return res.status(200).json({ category });
});

module.exports = {
  getProductById,
  getDetailByProductId,
  getAllproduct,
  categoryPage,
};
const productService = require('../services/productService');
const { catchError } = require('../middlewares/error');

const getProductById = catchError(async (req, res) => {
  const { productId } = req.params;
  const product = await productService.getProductById(productId);

  return res.status(200).json(product);
});

const getAllproduct = catchError(async (req, res) => {
  const { filter } = req.query;
  if (!filter) {
    const productsList = await productService.getAllproduct();
    return res.status(200).json(productsList);
  }
  const productsListFilter = await productService.getAllproductOrder(filter);
  return res.status(200).json(productsListFilter);
});

const categoryPage = catchError(async (req, res) => {
  const { mc, sc, pf } = req.query;
  const category = await productService.categoryPage(mc, sc, pf);
  return res.status(200).json(category);
});

module.exports = {
  getProductById,
  getAllproduct,
  categoryPage,
};

const cartDao = require('../models/cartDao');
const { addORupdateStatusEnum } = require('../middlewares/enums');

const createCartItem = async ({ userId, productId, quantity }) => {
  if (quantity <= 0) {
    const error = new Error('quantity must be more than 0');
    error.statusCode = 400;

    throw error;
  }

  const existProduct = await cartDao.findMatched(productId);
  if (existProduct.length == 0) {
    const error = new Error(`product with ID ${productId} not found`);
    error.statusCode = 400;

    throw error;
  }

  const existCartItem = await cartDao.existCartItem(userId, productId);

  if (existCartItem.length === 0) {
    await cartDao.createCartItem({
      userId,
      productId,
      quantity,
    });

    return 'cart created';
  } else {
    const addorupdatestatusEnum = addORupdateStatusEnum.ADD;

    return await cartDao.updateCartItemQuantity({
      userId,
      productId,
      quantity,
      addorupdatestatusEnum,
    });
  }
};

const getCartList = async (userId) => {
  return await cartDao.getCartList(userId);
};

const updatedCart = async (userId, productList) => {
  const addorupdatestatusEnum = addORupdateStatusEnum.UPDATE;

  const updatedCartItems = await Promise.all(
    productList.map(async (element) => {
      if (element.quantity <= 0) {
        await cartDao.deleteCart(userId, element.productId);
        return null;
      } else {
        const { updatedCartItem } = await cartDao.updateCartItemQuantity({
          quantity: element.quantity,
          userId: userId,
          productId: element.productId,
          addorupdatestatusEnum,
        });
        return updatedCartItem;
      }
    })
  );
  return updatedCartItems.filter((item) => item !== null);
};

const deleteCart = async (userId, productId) => {
  const existCartItem = await cartDao.findMatchedProductId(productId);

  if (existCartItem.length === 0) {
    const error = new Error(`cart with ID ${productId} not found in cartList`);
    error.statusCode = 400;

    throw error;
  }
  return await cartDao.deleteCart(userId, productId);
};

module.exports = {
  createCartItem,
  getCartList,
  updatedCart,
  deleteCart,
};

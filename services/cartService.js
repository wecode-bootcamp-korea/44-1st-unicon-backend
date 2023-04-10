const cartDao = require('../models/cartDao');

const createCartItem = async ({ userId, productId, quantity }) => {
  if (quantity <= 0) {
    const error = new Error('quantity must be more than 0');
    error.statusCode = 400;

    throw error;
  }

  const cart = await cartDao.findMatched(productId);
  if(cart.length==0){
    const error = new Error(`product with ID ${productId} not found`);
    error.statusCode = 400;

    throw error;
  }
  
  const cartItem = await cartDao.findMatchedProductId(productId);

  if (cartItem.length === 0) {
    await cartDao.createCartItem({
      userId,
      productId,
      quantity,
    });

    return 'cart created';
  } else {
    return await cartDao.addCartItemQuantity({ userId, productId, quantity });
  }
};

const getCartList = async (userId) => {
  return await cartDao.getCartList(userId);
};

const updatedCart = async ({ userId, productId, quantity }) => {
  if (quantity === 0) {
    await cartDao.deleteCart(userId, productId);

    return 'cartDeleted';
  }

  return await cartDao.updateCartItemQuantity({userId, productId, quantity});
};

const deleteCart = async ({ userId, productId }) => {

  const cart = await cartDao.findMatchedProductId(productId)
  if(cart.length==0){
    const error = new Error(`cart with ID ${productId} not found`);
    error.statusCode = 400;

    throw error;
  }
  return await cartDao.deleteCart({userId, productId});
};


module.exports = {
  createCartItem,
  getCartList,
  updatedCart,
  deleteCart,
};
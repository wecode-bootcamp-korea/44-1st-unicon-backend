const cartDao = require("../models/cartDao");

const createCartItem = async ({userId, productId, quantity }) => {
  if (quantity <= 0) {
    const error = new Error("quantity must be more than 0");
    error.statusCode = 400;

    throw error;
  }
  //if productId doesnt exist
  await cartDao.findMatched(productId);
  console.log(2)
   await cartDao.createCartItem({
    userId,
    productId,
    quantity,
  });
  console.log(3)
  return "cart created"
};

const getCartList = async (userId) => {

  return await cartDao.getCartList(userId);
};

const updateCart = async ({userId, productId, quantity}) =>{

    if(quantity ==0 ){
      await cartDao.deleteCart(userId, productId);

      return "cartDeleted"
    }

    await cartDao.patchCart(
        userId,
        productId,
        quantity
      );
    
      await cartDao.cartPatched(productId);
    
      return "cartUpdated"
} 

const deleteCart = async ({userId, productId}) => {
  await cartDao.deleteCart(
      userId,
      productId
  )
  return "cartDeleted"
}

module.exports = {
  createCartItem,
  getCartList,
  updateCart,
  deleteCart
};

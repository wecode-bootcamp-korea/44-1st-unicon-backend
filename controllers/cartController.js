const cartService = require('../services/cartService');
const catchError = require('./errorHandlers');

const createCartItem = catchError(async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const userId = req.userId;

    const cartItem = await cartService.createCartItem({
      userId,
      productId,
      quantity,
    });
    res.status(201).json({ message: cartItem });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const getCartList = async (req, res) => {
  try {
    const userId = req.userId;

    const cartList = await cartService.getCartList(userId);
    res.status(201).json({ message: cartList });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateCart = catchError(async (req, res) => {
  const userId = req.userId;

  const { quantity } = req.body;

  const productId = req.params;

  const update = await cartService.updatedCart({ userId, productId, quantity });

  res.status(201).json({ message: update });
});

const deleteCart = async (req, res) => {
  const userId = req.userId;
  const productId = req.params;

  const deleteCart = await cartService.deleteCart({ userId, productId });

  res.status(201).json({ message: deleteCart });
};

module.exports = {
  createCartItem,
  getCartList,
  updateCart,
  deleteCart,
};

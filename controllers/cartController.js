const cartService = require('../services/cartService');
const { catchError } = require('../middlewares/error');

const createCartItem = catchError(async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const userId = req.user.id;

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
    const userId = req.user.id;
    const cartList = await cartService.getCartList(userId);
    res.status(201).json({ cartList });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateCart = catchError(async (req, res) => {
  try{
  const userId = req.user.id;

  const { productId, quantity } = req.body;

  const update = await cartService.updatedCart({ userId, productId, quantity });

  res.status(201).json({ message: update });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const deleteCart = catchError(async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const deleteCart = await cartService.deleteCart({ userId, productId });

    res.status(201).json({ message: deleteCart });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = {
  createCartItem,
  getCartList,
  updateCart,
  deleteCart,
};

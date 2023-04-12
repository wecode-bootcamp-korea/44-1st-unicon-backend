const cartService = require('../services/cartService');
const { catchError } = require('../middlewares/error');

const createCartItem = catchError(async (req, res) => {
    const { productId, quantity } = req.body;

    const userId = req.user.id;

    const cartItem = await cartService.createCartItem({
      userId,
      productId,
      quantity,
    });
    res.status(200).json({ message: cartItem });
 
});

const getCartList = async (req, res) => {
    const userId = req.user.id;
    const cartList = await cartService.getCartList(userId);
    res.status(200).json( cartList );
};

const updateCart = catchError(async (req, res) => {
  const userId = req.user.id;

  //productId = [ ]
  //quantity = [ ]

  const { productId, quantity } = req.body;

  const update = await cartService.updatedCart({ userId, productId, quantity });

  res.status(200).json({ message: update });
});

const deleteCart = catchError(async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    await cartService.deleteCart({ userId, productId });

    res.status(204).send();
});

module.exports = {
  createCartItem,
  getCartList,
  updateCart,
  deleteCart,
};

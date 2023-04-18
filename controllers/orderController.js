const orderService = require('../services/orderService.js');
const { catchError } = require('../middlewares/error.js');
const orderError = require('../middlewares/orderError.js');

const createOrders = catchError(async (req, res) => {
  const userId = req.user.id;

  await orderError.emptyCartErrorHandle(userId);

  await orderError.priceErrorHandle(userId);

  if (!userId) {
    return res.status(400).json({ message: 'INVALID_USER' });
  }

  const result = await orderService.createOrderAndItems(userId);
  return res.status(201).json(result);
});

const executeOrder = catchError(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: 'INVALID_USER' });
  }

  const result = await orderService.executedOrder(userId);
  return res.status(201).json({ message: result });
});

const purchaseditems = catchError(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ message: 'INVALID_USER' });
  }
  const items = await orderService.purchaseditems(userId);
  return res.status(200).json(items);
});

module.exports = {
  createOrders,
  executeOrder,
  purchaseditems,
};

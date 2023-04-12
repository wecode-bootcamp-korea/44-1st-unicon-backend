const orderService = require('../services/orderService.js');
const { catchError } = require('../middlewares/error.js');


const createOrders = catchError(async (req, res) => {

  const userId = req.user.id 

  if (!userId) {
    return res.status(400).json({ message: 'INVALID_USER' });
  }
 
  const result = await orderService.createOrderAndItems(userId);
  return res.status(201).json(result );
});

const executeOrder = catchError(async (req, res) => {

  const userId= req.user.id 

  if (!userId) {
    return res.status(400).json({ message: 'INVALID_USER' });
  }
 
  const result = await orderService.executedOrder(userId);
  return res.status(201).json({ message: result });
});



module.exports = {
  createOrders,
  executeOrder
};
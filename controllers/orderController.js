const orderService = require('../services/orderService.js');
const { catchError } = require('../middlewares/error.js');


const createOrders = catchError(async (req, res) => {

  const userId= req.user.id 

  if (!userId) {
    return res.status(400).json({ message: 'KEY_ERROR' });
  }
 
  const result = await orderService.createOrders(userId);
  return res.status(201).json({ message: result });
});


module.exports = {
  createOrders,
};
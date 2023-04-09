const orderDao = require('../models/orderDao');

const createOrders = async (userId) => {
  try {
    const orders = await orderDao.findMatchedOrdersByUserId(userId);

    if (orders === undefined || orders === null) {
      await orderDao.createOrders(userId);
    }

    //product_id에 대한 order_item이 존재하는 경우, createOrder을 안함
    const orderId = await orderDao.createOrderItems(userId);

    const totalAmount = await orderDao.updatedOrders(orderId);

    const imageUrl = await orderDao.getImageUrlByProductId(orderId);

    const userInfo = await orderDao.getUserInfoByUserId(userId);

    return { totalAmount, imageUrl, userInfo };
  } catch (err) {
    throw new Error(
      `Failed to create orders for userId ${userId}: ${err.message}`
    );
  }
};

const executedOrder = async (userId) => {
  try {
    const currentPoints = (await orderDao.getUserInfoByUserId(userId)).map(
      (result) => result['currentPoints']
    );

    await orderDao.executedOrder(userId);

    const remainingPoints = (await orderDao.getUserInfoByUserId(userId)).map(
      (result) => result['currentPoints']
    );

    return {currentPoints, remainingPoints}
  } catch (err) {
    throw new Error(
      `Failed to create orders for userId ${userId}: ${err.message}`
    );
  }
};

module.exports = {
  createOrders,
  executedOrder,
};

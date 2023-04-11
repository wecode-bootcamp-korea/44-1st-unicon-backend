const orderDao = require('../models/orderDao');

const createOrders = async (userId) => {
  try {
    const orders = await orderDao.findMatched(userId);
    let orderId;

    if (orders.length === 0 || orders[0].order_status_id === 2) {
      await orderDao.createOrders(userId, 1);
      const newOrders = await orderDao.findMatched(userId, 1);
      orderId = newOrders[0].id;

      await orderDao.createOrderItems(userId, orderId);
    } else {
      console.log(orders);
      orderId = orders[0].id;
      await orderDao.createOrderItems(userId, orderId);
    }

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

const createOrderAndItems = async (userId) => {
  let orderId;
  let totalAmount;
  let imageUrl;
  let userInfo;

  try {
    const orders = await orderDao.findMatched(userId, connection);

    if (orders.length === 0 || orders[0].order_status_id === 2) {
      await orderDao.createOrders(userId, 1, connection);
      const newOrders = await orderDao.findMatched(userId, 1, connection);
      orderId = newOrders[0].id;

      await orderDao.createOrderItems(userId, orderId, connection);
    } else {
      orderId = orders[0].id;
      await orderDao.createOrderItems(userId, orderId, connection);
    }

    totalAmount = await orderDao.updatedOrders(orderId, connection);
    imageUrl = await orderDao.getImageUrlByProductId(orderId, connection);
    userInfo = await orderDao.getUserInfoByUserId(userId, connection);
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

    return { currentPoints, remainingPoints };
  } catch (err) {
    throw new Error(
      `Failed to create orders for userId ${userId}: ${err.message}`
    );
  }
};

module.exports = {
  createOrders,
  executedOrder,
  createOrderAndItems
};

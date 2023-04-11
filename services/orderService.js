const orderDao = require('../models/orderDao');

const createOrders = async (userId) => {
  try {
    const orders = await orderDao.findMatched(userId);
    console.log("orders: "+JSON.stringify( orders) )
    let orderId;
    if (orders.length ===0 || orders[0].order_status_id === 2) {
      await orderDao.createOrders(userId,1);
      const newOrders = await orderDao.findMatched(userId,1);
      orderId = newOrders[0].id

      await orderDao.createOrderItems(userId);
    } else {
        console.log(orders)
        orderId = orders[0].id;
    }
    console.log(orderId)
    const totalAmount = await orderDao.updatedOrders(orderId);

    // const imageUrl = await orderDao.getImageUrlByProductId(orderId);

    // const userInfo = await orderDao.getUserInfoByUserId(userId);

    // return { totalAmount, imageUrl, userInfo };
    return totalAmount;

  } catch (err) {
    throw new Error(
      `Failed to create orders for userId ${userId}: ${err.message}`
    );
  }
};

const executedOrder = async (userId) => {
  try {
    // status_id가 1일 경우에만 결제 

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

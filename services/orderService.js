const orderDao = require('../models/orderDao');

const createOrders = async (userId) => {
  try {
    const orders = await orderDao.findMatchedOrdersByUserId(userId);

    if (orders === undefined || orders === null) {
      await orderDao.createOrders(userId);
    }

    //product_id에 대한 order_item이 존재하는 경우, createOrder을 안함
    const orderId =await orderDao.createOrderItems(userId);

    const totalAmount = await orderDao.updatedOrders(orderId);

    const imageUrl = await orderDao.getImageUrlByProductId(orderId);

    return {totalAmount, imageUrl};
  } catch (err) {
    console.log(err);
    throw new Error(
      `Failed to create orders for userId ${userId}: ${err.message}`
    );
  }
};

//금액 총 합, 각 product_id에 대한 imgurl 호출 구현 필수

module.exports = {
  createOrders,
};

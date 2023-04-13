const orderDao = require('../models/orderDao');
const appDataSource = require('../models/appDataSource');

const createOrders = async (userId) => {
  try {
    const orders = await orderDao.findMatched(userId);
    let orderId;

    if (orders.length === 0 || orders[0].order_status_id === 2) {
      await orderDao.createOrders(userId, 1);
      const newOrders = await orderDao.findMatched(userId, 1);
      orderId = newOrders[0].id;

      await orderDao.createOrderAndItems(userId, orderId);
    } else {
      orderId = orders[0].id;
      await orderDao.createOrderAndItems(userId, orderId);
    }

    const totalAmount = await orderDao.updatedOrders(orderId);

    const imageUrl = await orderDao.getImageUrlByProductId(orderId);

    const userInfo = await orderDao.getUserInfoByUserId(userId);

    return totalAmount, imageUrl, userInfo;
  } catch (err) {
    throw new Error(
      `Failed to create orders for userId ${userId}: ${err.message}`
    );
  }
};

const createOrderAndItems = async (userId) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.startTransaction();

  let orderId;
  let totalAmount;
  let imageUrl;
  let userInfo;

  try {
    const orders = await orderDao.findMatched(userId);

    if (orders.length === 0 || orders[0].order_status_id === 2) {
      await orderDao.createOrders(userId, 1);
      const newOrders = await orderDao.findMatched(userId);
      orderId = newOrders[0].id;

      totalAmount = await orderDao.createOrderAndItems(userId, orderId);
    } else {
      orderId = orders[0].id;
      totalAmount = await orderDao.createOrderAndItems(userId, orderId);
    }

    imageUrl = await orderDao.getImageUrlByProductId(orderId);
    userInfo = await orderDao.getUserInfoByUserId(userId);

    await queryRunner.commitTransaction();

    return {
      totalAmount: totalAmount,
      imageUrl: imageUrl,
      userInfo: userInfo,
    };
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw new Error(
      `Failed to create orders for userId ${userId}: ${err.message}`
    );
  } finally {
    await queryRunner.release();
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
  createOrderAndItems,
};

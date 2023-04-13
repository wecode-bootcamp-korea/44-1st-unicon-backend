const orderStatusEnum = Object.freeze({
  PENDING_PAYMENT: 1,
  COMPLETE_PAYMENT: 2,
  DELIVERING: 3,
  DELIVERY_COMPLETED: 4,
});

module.exports = { orderStatusEnum };

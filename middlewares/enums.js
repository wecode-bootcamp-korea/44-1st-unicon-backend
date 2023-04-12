const orderStatusEnum = Object.freeze({
  PENDING_PAYMENT: 1,
  COMPLETED_PAYMENT: 2,
  DELIVERING: 3,
  DELIVERY_COMPLETE: 4,
});

module.export ={ orderStatusEnum};
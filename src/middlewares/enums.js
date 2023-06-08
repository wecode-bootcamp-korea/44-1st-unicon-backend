const orderStatusEnum = Object.freeze({
  PENDING_PAYMENT: 1,
  COMPLETE_PAYMENT: 2,
  DELIVERING: 3,
  DELIVERY_COMPLETED: 4,
});

const defaltProductListEnum = Object.freeze({
  DEFAULT_LIMIT: 15,
  DEFAULT_OFFSET: 0,
});

const addORupdateStatusEnum = Object.freeze({
  ADD: 0,
  UPDATE: 1,
});

module.exports = {
  orderStatusEnum,
  defaltProductListEnum,
  addORupdateStatusEnum,
};

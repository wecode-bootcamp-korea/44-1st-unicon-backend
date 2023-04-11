-- migrate:up
SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE order_status DROP FOREIGN KEY ordersId_orderStatus_FK;
ALTER TABLE order_status DROP COLUMN order_id;
DROP TABLE order_item_status;

ALTER TABLE orders ADD COLUMN order_status_id INT NOT NULL DEFAULT 1;
ALTER TABLE orders ADD CONSTRAINT orders_order_status_fk FOREIGN KEY (order_status_id) REFERENCES order_status(id);

ALTER TABLE users MODIFY points DECIMAL(12,2) DEFAULT 100000000;
ALTER TABLE orders MODIFY COLUMN total_amount INT NOT NULL DEFAULT 0;

SET FOREIGN_KEY_CHECKS=1;

-- migrate:down

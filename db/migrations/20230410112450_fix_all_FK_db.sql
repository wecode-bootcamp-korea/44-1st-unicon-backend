-- migrate:up
SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE order_status DROP COLUMN order_id;
ALTER TABLE orders DROP COLUMN order_status_id;







UPDATE order_status SET status = 'PENDING_PAYMENT' WHERE id = 1;
UPDATE order_status SET status = 'COMPLETED_PAYMENT' WHERE id = 2;
UPDATE order_status SET status = 'DELIVERING' WHERE id = 3;
UPDATE order_status SET status = 'DELIVERY_COMPLETED' WHERE id = 4;


ALTER TABLE users MODIFY points DECIMAL(50,2) DEFAULT 100000000;
ALTER TABLE orders MODIFY COLUMN total_amount INT NOT NULL DEFAULT 0;


SET FOREIGN_KEY_CHECKS=1;
-- migrate:down

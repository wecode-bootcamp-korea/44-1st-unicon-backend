ALTER TABLE orders
ADD COLUMN order_status_id INT NOT NULL DEFAULT 1,
ADD CONSTRAINT orders_order_status_fk FOREIGN KEY (order_status_id) REFERENCES order_status(id);

ALTER TABLE orders
DROP FOREIGN KEY userId_orders_FK,
ADD CONSTRAINT orders_user_fk FOREIGN KEY (user_id) REFERENCES users(id);

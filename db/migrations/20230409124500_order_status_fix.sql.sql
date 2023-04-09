ALTER TABLE order_status DROP COLUMN order_id;

UPDATE order_status SET status = 'PENDING_PAYMENT' WHERE id = 1;
UPDATE order_status SET status = 'COMPLETED_PAYMENT' WHERE id = 2;
UPDATE order_status SET status = 'DELIVERING' WHERE id = 3;
UPDATE order_status SET status = 'DELIVERY_COMPLETED' WHERE id = 4;

ALTER TABLE order_status
ADD COLUMN order_status_id INT NOT NULL DEFAULT 1,
ADD CONSTRAINT order_status_order_fk FOREIGN KEY (order_status_id) REFERENCES order_status(id);
-- migrate:up

UPDATE order_status SET status = 'PENDING_PAYMENT' WHERE id = 1;
UPDATE order_status SET status = 'COMPLETED_PAYMENT' WHERE id = 2;
UPDATE order_status SET status = 'DELIVERING' WHERE id = 3;
UPDATE order_status SET status = 'DELIVERY_COMPLETED' WHERE id = 4;
-- migrate:down


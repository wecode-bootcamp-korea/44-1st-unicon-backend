-- migrate:up
ALTER TABLE orders MODIFY COLUMN total_amount INT NOT NULL DEFAULT 0;
-- migrate:down
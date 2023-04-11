-- migrate:up
ALTER TABLE cart RENAME COLUMN product_items TO product_id;

-- migrate:down


-- migrate:up
ALTER TABLE cart
MODIFY COLUMN product_items INT,
ADD COLUMN quantity INT,
ADD CONSTRAINT productId_FK FOREIGN KEY (product_items) REFERENCES product(id);
-- migrate:down
ALTER TABLE cart
DROP COLUMN quantity,
MODIFY COLUMN product_items JSON,
DROP CONSTRAINT productId_FK;
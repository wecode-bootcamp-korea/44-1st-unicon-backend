-- migrate:up
CREATE TABLE orders (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_number VARCHAR(200),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  total_amount INT,
  PRIMARY KEY(id),
  CONSTRAINT userId_orders_FK FOREIGN KEY (user_id) REFERENCES users(id)
)
-- migrate:down


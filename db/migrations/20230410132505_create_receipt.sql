- migrate:up
 CREATE TABLE receipt (
  id INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  order_number VARCHAR(200),
  user_id  INT NOT NULL,
  lists JSON,
  total_amount INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(id),
  CONSTRAINT user_id_FK FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT order_id_FK FOREIGN KEY (order_id) REFERENCES orders(id)
)
-- migrate:down
DROP TABLE receipt;
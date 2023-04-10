-- migrate:up
CREATE TABLE payment (
  id INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  order_number VARCHAR(200),
  user_id  INT NOT NULL,
  total_price INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(id),
  CONSTRAINT user_id_FK FOREIGN KEY (user_id) REFERENCES orders(user_id),
  CONSTRAINT order_number_FK FOREIGN KEY (order_number) REFERENCES orders(order_number),
  CONSTRAINT total_price_FK FOREIGN KEY (total_price) REFERENCES orders(total_amount)
  CONSTRAINT order_id_FK FOREIGN KEY (order_id) REFERENCES orders(id)
)
-- migrate:down
DROP TABLE payment;
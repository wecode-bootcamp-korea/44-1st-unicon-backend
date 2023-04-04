-- migrate:up
CREATE TABLE order_item (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT,
  price INT,
  PRIMARY KEY(id),
  CONSTRAINT userId_orderItem_FK FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT ordersId_orderItem_FK FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT productId_orderItem_FK FOREIGN KEY (product_id) REFERENCES product(id)
)
-- migrate:down


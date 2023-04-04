-- migrate:up
CREATE TABLE order_status (
  id INT NOT NULL AUTO_INCREMENT,
  status VARCHAR(50),
  order_id INT NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT ordersId_orderStatus_FK FOREIGN KEY (order_id) REFERENCES orders(id)
)
-- migrate:down


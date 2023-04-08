-- migrate:up
CREATE TABLE payment (
  id INT NOT NULL AUTO_INCREMENT,
  user_id  VARCHAR(100) NOT NULL,
  order_item_id INT NOT NULL,
  order

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY(id),
  CONSTRAINT orderItemID_orderItemStatus_FK FOREIGN KEY (order_item_id) REFERENCES order_item(id)
)
-- migrate:down
DROP TABLE order_item_status;
-- migrate:up
CREATE TABLE order_item_status (
  id INT NOT NULL AUTO_INCREMENT,
  status VARCHAR(50),
  order_item_id INT NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT orderItemID_orderItemStatus_FK FOREIGN KEY (order_item_id) REFERENCES order_item(id)
)
-- migrate:down
DROP TABLE order_item_status;
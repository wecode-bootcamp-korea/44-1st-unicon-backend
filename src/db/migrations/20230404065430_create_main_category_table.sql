-- migrate:up
CREATE TABLE product_detail (
  id INT NOT NULL AUTO_INCREMENT,
  descriptions VARCHAR(300),
  product_id INT,
  PRIMARY KEY(id),
  CONSTRAINT productId_productDetail_FK FOREIGN KEY (product_id) REFERENCES product(id)
)
-- migrate:down
DROP TABLE product_detail;
-- migrate:up
CREATE TABLE product (
  id INT NOT NULL AUTO_INCREMENT,
  names VARCHAR(50),
  descriptions VARCHAR(300),
  sub_description VARCHAR(100),
  sub_category_id INT,
  price INT,
  product_size JSON,
  rating_average FLOAT,
  is_new BOOLEAN ,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY(id),
  CONSTRAINT subCategory_product_FK FOREIGN KEY (sub_category_id) REFERENCES sub_category(id)
)
-- migrate:down


-- migrate:up
CREATE TABLE sub_category (
  id INT NOT NULL AUTO_INCREMENT,
  comment VARCHAR(100),
  main_category_id INT,
  title VARCHAR(50),
  PRIMARY KEY(id),
  CONSTRAINT mainCategory_subCategory_FK FOREIGN KEY (main_category_id) REFERENCES main_category(id)
)
-- migrate:down
DROP TABLE sub_category;

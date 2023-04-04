-- migrate:up
CREATE TABLE review (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(50),
  content VARCHAR(500),
  rating FLOAT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  CONSTRAINT producId_review_FK FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT userId_review_FK FOREIGN KEY (user_id) REFERENCES users(id)
)
-- migrate:down


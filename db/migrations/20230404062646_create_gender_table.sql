-- migrate:up
CREATE TABLE gender (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  gender_type VARCHAR(10),
  user_id INT NOT NULL,
  CONSTRAINT userId_gender_FK FOREIGN KEY (user_id) REFERENCES users(id)
)
-- migrate:down


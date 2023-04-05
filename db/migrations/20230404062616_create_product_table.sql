-- migrate:up
CREATE TABLE main_category(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50)
)
-- migrate:down
DROP TABLE main_category;
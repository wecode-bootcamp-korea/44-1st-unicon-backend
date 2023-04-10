-- migrate:up
CREATE TABLE show_room(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(2000),
  descriptions VARCHAR(1000)
)
-- migrate:down
DROP TABLE show_room;
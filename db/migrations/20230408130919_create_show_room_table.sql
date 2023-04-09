-- migrate:up
CREATE TABLE show_room(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(2000)
)

ALTER TABLE product ADD show_room_id INT NULL,

ALTER TABLE product ADD CONSTRAINT show_room_id_product_FK FOREIGN KEY(show_room_id) REFERENCES show_room(id)
-- migrate:down
DROP TABLE show_room;
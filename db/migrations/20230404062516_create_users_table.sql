-- migrate:up
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  names VARCHAR(50) NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL ,
  passwords VARCHAR(200) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  addresses VARCHAR(200),
  birth DATE,
  points DECIMAL(7,2),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
)
-- migrate:down


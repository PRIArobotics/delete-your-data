\c template1
DROP DATABASE dyd
CREATE DATABASE dyd
\c dyd

-- still needs to be updated
DROP TABLE IF EXISTS plugins CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS index CASCADE;


-- Missing TYPE
CREATE TABLE plugins(
 plugin_uuid VARCHAR(32) PRIMARY KEY,
 plugin_name VARCHAR (128) NOT NULL,
 config VARCHAR(4096)
);

-- CHECK MISSING
CREATE TABLE users(
  --PSQL
  user_id SERIAL PRIMARY KEY,
  --SQL
  -- user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_uuid VARCHAR(32),
  plugin_uuid VARCHAR(32),
  native_id VARCHAR(256),
  FOREIGN KEY (plugin_uuid) REFERENCES plugins(plugin_uuid)
  ON UPDATE CASCADE
);

-- CHECK MISSING
CREATE TABLE index(
  --PSQL
  index_id SERIAL PRIMARY KEY,
  --SQL
  -- index_id INT AUTO_INCREMENT PRIMARY KEY,
  instant DATETIME,
  user_uuid VARCHAR(32),
  savelocation VARCHAR(256),
  FOREIGN KEY (user_uuid) REFERENCES users(user_uuid)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

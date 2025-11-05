
-- facts
CREATE TABLE IF NOT EXISTS facts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity TEXT NOT NULL,
  attr   TEXT NOT NULL,
  value  TEXT NOT NULL,
  lang   VARCHAR(8) DEFAULT 'en',
  tags   JSON NULL,
  UNIQUE KEY uniq_fact ( (MD5(CONCAT(entity,'::',attr,'::',IFNULL(lang,'')))) )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- events
CREATE TABLE IF NOT EXISTS events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title TEXT NOT NULL,
  datetime DATETIME NOT NULL,
  venue TEXT NULL,
  description_en TEXT NULL,
  description_it TEXT NULL,
  tags JSON NULL,
  UNIQUE KEY uniq_event ( (MD5(CONCAT(title,'::',datetime))) )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

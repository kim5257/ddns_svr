BEGIN TRANSACTION;
DROP TABLE IF EXISTS `resv_names`;
CREATE TABLE IF NOT EXISTS `resv_names` (
	`name`	TEXT,
	PRIMARY KEY(`name`)
);
INSERT INTO `resv_names` VALUES ('ns');
INSERT INTO `resv_names` VALUES ('ns1');
INSERT INTO `resv_names` VALUES ('ns2');
INSERT INTO `resv_names` VALUES ('admin');
INSERT INTO `resv_names` VALUES ('root');
DROP TABLE IF EXISTS `bind_info`;
CREATE TABLE IF NOT EXISTS `bind_info` (
	`name`	TEXT NOT NULL,
	`ip`	TEXT NOT NULL,
	`update_time`	TEXT DEFAULT (strftime('%Y%m%d%H%M%S',datetime('now','localtime'))),
	FOREIGN KEY(`name`) REFERENCES `names`(`name`),
	PRIMARY KEY(`name`)
);
DROP TABLE IF EXISTS `names`;
CREATE TABLE IF NOT EXISTS `names` (
	`name`	TEXT NOT NULL,
	`id`	TEXT NOT NULL,
	PRIMARY KEY(`name`),
	FOREIGN KEY(`id`) REFERENCES `users`(`id`)
);
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
	`id`	TEXT NOT NULL,
	`pw`	TEXT NOT NULL,
	PRIMARY KEY(`id`)
);
DROP INDEX IF EXISTS `idx_bind_info`;
CREATE INDEX IF NOT EXISTS `idx_bind_info` ON `bind_info` (
	`name`
);
DROP INDEX IF EXISTS `idx_names`;
CREATE INDEX IF NOT EXISTS `idx_names` ON `names` (
	`name`
);
DROP INDEX IF EXISTS `idx_users`;
CREATE INDEX IF NOT EXISTS `idx_users` ON `users` (
	`id`
);
DROP TRIGGER IF EXISTS `del_user`;
CREATE TRIGGER del_user
BEFORE DELETE ON users
BEGIN
	DELETE FROM names WHERE OLD.id=id;
END;
DROP TRIGGER IF EXISTS `del_name`;
CREATE TRIGGER del_name
BEFORE DELETE ON names
BEGIN
	DELETE FROM bind_info WHERE OLD.name=name;
END;
DROP TRIGGER IF EXISTS `add_name`;
CREATE TRIGGER add_name
BEFORE INSERT ON names
WHEN NEW.name IN ( SELECT name FROM resv_names )
BEGIN
	SELECT RAISE(abort, 'Reserved name');
END;
COMMIT;

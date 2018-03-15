SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL COMMENT '用户名',
  `passwd` varchar(255) DEFAULT NULL COMMENT '密码',
  `active` int(11) DEFAULT '0' COMMENT '账号状态,0 表示禁用；1表示启用',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱地址',
  `add_time` datetime DEFAULT NULL COMMENT '注册时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admin', 'pbkdf2:sha256:50000$WvEfhlXc$bbaa28ede94ca44c9d6ae003c49d5e3e93185316962ba64c1a081605d110438e', '1', null, null);

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
  `login_time` datetime DEFAULT NULL COMMENT '最近登录时间',
  `full_name` varchar(255) DEFAULT NULL COMMENT '姓名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admin', 'pbkdf2:sha256:50000$Gk3js0Ax$2c47bb03bd9ecb826bc99f34a0f46169cc81d83a9ad4ebb1fc8a98a5aa1194a6', '1', null, '2018-03-15 16:17:35', '2018-03-16 13:44:31', '超级管理员');

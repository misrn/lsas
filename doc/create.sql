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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admin', 'pbkdf2:sha256:50000$Gk3js0Ax$2c47bb03bd9ecb826bc99f34a0f46169cc81d83a9ad4ebb1fc8a98a5aa1194a6', '1', null, '2018-03-15 16:17:35', '2018-03-16 13:44:31', '超级管理员');


DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_name` varchar(255) DEFAULT NULL COMMENT '项目名称',
  `add_time` datetime DEFAULT NULL COMMENT '添加时间',
  `up_time` datetime DEFAULT NULL COMMENT '更新时间',
  `pre_version` int(11) DEFAULT NULL COMMENT '预发布版本号',
  `type` varchar(255) DEFAULT NULL COMMENT '项目类型',
  `pro_version` int(11) DEFAULT NULL COMMENT '生产环境版本号',
  `svn_addr` varchar(255) DEFAULT NULL COMMENT 'Svn地址',
  `app_path` varchar(255) DEFAULT NULL COMMENT '部署路径',
  `loca_path` varchar(255) DEFAULT NULL COMMENT '本地路径',
  `pre_hosts` varchar(255) DEFAULT NULL COMMENT '预发布服务器地址',
  `pro_hosts` varchar(255) DEFAULT NULL COMMENT '生产服务器地址',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `hosts`;
CREATE TABLE `hosts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hostname` varchar(255) NOT NULL COMMENT '主机名',
  `os` varchar(255) DEFAULT NULL COMMENT '服务器发行版本',
  `osrelease` varchar(255) DEFAULT NULL COMMENT '发行版本',
  `kernelrelease` varchar(255) DEFAULT NULL COMMENT '内核版本',
  `mem_total` int(20) DEFAULT NULL COMMENT '内存大小（单位M）',
  `num_cpus` int(255) DEFAULT NULL COMMENT 'cpu核数',
  `add_time` datetime DEFAULT NULL COMMENT '添加时间',
  `up_time` datetime DEFAULT NULL COMMENT '更新时间',
  `selinux` varchar(255) DEFAULT NULL COMMENT '服务器selinux状态',
  `status` int(255) DEFAULT NULL COMMENT '主机状态,0 表示离线；1表示正常 ; 其他表示未知',
  `eth0_ipaddr` varchar(255) DEFAULT NULL COMMENT 'eth0网卡IP地址',
  PRIMARY KEY (`id`),
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for deploy_logs
-- ----------------------------
DROP TABLE IF EXISTS `deploy_logs`;
CREATE TABLE `deploy_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deploy_user` varchar(255) DEFAULT NULL COMMENT '发布人',
  `deploy_project_id` int(11) DEFAULT NULL COMMENT '发布项目',
  `deploy_time` datetime DEFAULT NULL COMMENT '发布时间',
  `deploy_txt` text COMMENT '发布备注',
  `deploy_version` int(11) DEFAULT NULL COMMENT '发布版本',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


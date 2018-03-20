SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for hosts
-- ----------------------------
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
  PRIMARY KEY (`id`),
  KEY `HK_ENGINE_ROOM_ID` (`selinux`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

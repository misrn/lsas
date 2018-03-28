SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for project
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

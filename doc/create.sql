SET FOREIGN_KEY_CHECKS=0;

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
  `eth0_ipaddr` varchar(255) DEFAULT NULL COMMENT 'eth0网卡IP地址',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for jurisdiction
-- ----------------------------
DROP TABLE IF EXISTS `jurisdiction`;
CREATE TABLE `jurisdiction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jurisdiction_name` varchar(255) DEFAULT NULL COMMENT '权限名称',
  `jurisdiction_text` varchar(255) DEFAULT NULL COMMENT '权限标签',
  `add_time` datetime DEFAULT NULL COMMENT '添加时间',
  `describe` varchar(255) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of jurisdiction
-- ----------------------------
INSERT INTO `jurisdiction` VALUES ('1', '系统管理/用户管理', 'sys.users_mg', '2018-05-02 14:43:29', '允许用户查看/编辑/新增/删除用户');
INSERT INTO `jurisdiction` VALUES ('3', '系统管理/角色管理', 'sys.role_mg', '2018-05-02 15:14:46', '允许用户查看/编辑/新增/删除角色');
INSERT INTO `jurisdiction` VALUES ('4', '系统管理/权限维护', 'sys.jurisdiction_mg', '2018-05-02 17:05:44', '允许用户查看/编辑/新增/删除权限信息');
INSERT INTO `jurisdiction` VALUES ('5', '密码修改', 'sys.repasswd', '2018-05-02 17:08:22', '允许用户修改密码');
INSERT INTO `jurisdiction` VALUES ('6', 'salt管理/代码提交', 'salt.svnmg', '2018-05-02 17:12:20', '允许用户提交salt文件到svn仓库');
INSERT INTO `jurisdiction` VALUES ('7', 'salt管理/文件编辑', 'salt.filemg', '2018-05-02 17:25:20', '允许用户在线编辑saltstack配置文件。包含新增/重命名/删除文件及文件夹，编辑文件内容');
INSERT INTO `jurisdiction` VALUES ('8', 'salt管理/命令执行', 'salt.cmdmg', '2018-05-02 17:27:28', '允许用户执行saltstack自定义模块及shell命令');
INSERT INTO `jurisdiction` VALUES ('9', '发布系统/项目管理', 'deploy.projectmg', '2018-05-02 17:31:41', '允许用户查看/编辑/新增/删除项目');
INSERT INTO `jurisdiction` VALUES ('10', '发布系统/代码发布', 'deploy.pushmg', '2018-05-03 10:24:43', '允许用户对生产代码进行推送');
INSERT INTO `jurisdiction` VALUES ('11', '固定资产/主机列表', 'assets.hostsmg', '2018-05-03 10:27:51', '允许用户查看/更新主机及显示主机详细信息');

-- ----------------------------
-- Table structure for operation_logs
-- ----------------------------
DROP TABLE IF EXISTS `operation_logs`;
CREATE TABLE `operation_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL COMMENT '操作类型',
  `time` datetime DEFAULT NULL COMMENT '操作时间',
  `tex` varchar(255) DEFAULT NULL COMMENT '备注',
  `user` varchar(255) DEFAULT NULL COMMENT '用户',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) DEFAULT NULL COMMENT '角色名称',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `role_text` varchar(255) DEFAULT NULL COMMENT '角色标签',
  `jurisdiction` varchar(255) DEFAULT NULL COMMENT '权限字段；以逗号分割',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES ('1', '超级管理员', '2018-04-27 09:23:57', 'admin', 'sys.role_mg,sys.users_mg,sys.jurisdiction_mg,sys.repasswd,salt.svnmg,salt.cmdmg,salt.filemg,deploy.pushmg,assets.hostsmg,deploy.projectmg');
INSERT INTO `roles` VALUES ('2', '普通用户', '2018-05-03 12:36:15', 'ordinary', '');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL COMMENT '用户名',
  `passwd` varchar(255) DEFAULT NULL COMMENT '密码',
  `active` int(11) DEFAULT '0' COMMENT '账号状态,0 表示禁用；1表示启用 ; 其他表示未知',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱地址',
  `add_time` datetime DEFAULT NULL COMMENT '注册时间',
  `login_time` datetime DEFAULT NULL COMMENT '最近登录时间',
  `full_name` varchar(255) DEFAULT NULL COMMENT '姓名',
  `role_id` int(11) DEFAULT NULL COMMENT '角色ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admin', 'pbkdf2:sha256:50000$Gk3js0Ax$2c47bb03bd9ecb826bc99f34a0f46169cc81d83a9ad4ebb1fc8a98a5aa1194a6', '1', 'xxxxx@qq.com', '2018-03-15 16:17:35', '2018-05-03 12:46:19', 'admin', '1');

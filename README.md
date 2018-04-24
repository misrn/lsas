# lsas

开发语言：python

python框架：flask

实现功能

- 用户登录，及其url登录保护
- 用户注册，注册的账户默认是禁用
- 用户管理，启用/禁用/删除操作
- 资产管理，通过saltstack api接口更新固定资产;ip地址默认是获取eth0网卡地址
- Salt管理，在线实现saltstack配置文件的编辑 ; 默认配置文件目录/data/salt ; salt master 配置文件参考：[master](https://github.com/fandaye/lsas/blob/master/doc/master)
- 发布系统，项目管理 新增/删除
- 发布系统，代码发布[预发布环境暂未开发] 发布项目
- tomcat日志在线查看；每一台服务器需要放置一个shell脚本：参考[out_file.sh](https://github.com/fandaye/lsas/blob/master/doc/out_file.sh)
- 记录操作日志

默认账户/密码：admin/passwd

1. 安装salt api ； api配置参考[api.conf](https://github.com/fandaye/lsas/blob/master/doc/api.conf)
2. 安装python模块
3. 导入数据库 [create.sql](https://github.com/fandaye/lsas/blob/master/doc/create.sql)
4. 创建配置文件app/config/config.py；参考模板[config-example.py](https://github.com/fandaye/lsas/blob/master/doc/config-example.py)

首页：http://127.0.0.1/
注册页面：http://127.0.0.1/register

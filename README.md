# lsas

开发语言：python

python框架：flask

实现功能

- 用户登录，及其url登录保护
- 用户注册，注册的账户默认是禁用
- 用户管理，启用/禁用/删除操作
- 资产管理，通过saltstack api接口更新固定资产;ip地址默认是获取eth0网卡地址
- Salt管理，在线实现saltstack配置文件的编辑 ; 默认配置文件目录/data/salt ; salt master 配置文件参考：[master](https://github.com/fandaye/lsas/blob/master/doc/master)

默认账户/密码：admin/passwd

导入数据库 [users.sql](https://github.com/fandaye/lsas/blob/master/doc/users.sql) ， [hosts.sql](https://github.com/fandaye/lsas/blob/master/doc/hosts.sql)

添加配置文件app/config/config.py；参考模板[config-example.py](https://github.com/fandaye/lsas/blob/master/doc/config-example.py)

首页：http://127.0.0.1/
注册页面：http://127.0.0.1/register

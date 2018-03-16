# lsas

实现功能

- 用户登录，及其url登录保护
- 用户注册
- 用户管理，启用/禁用/删除操作

基于python flask框架实现注册及登录； 默认账户/密码：admin/passwd

导入数据库 [users.sql](https://github.com/fandaye/lsas/blob/master/doc/users.sql)

注册页面：http://127.0.0.1/register

账户注册成功后；需要修改用户表字段`active`值为1；

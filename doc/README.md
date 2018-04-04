# 配置参数说明

DEBUG :flask框架debug开关

SQLALCHEMY_DATABASE_URI : 数据了连接地址用户名/密码/库   格式 'mysql://user:passwd@127.0.0.1:3306/laas'


SALT_API_ADDR   ： saltstack api 地址
SALT_API_PROT   ： saltstack api 端口
SALT_API_USER   ： saltstack api 用户名
SALT_API_PASSWD ： saltstack api 密码


SVN_ADDR        ： svn地址前缀； 如svn地址为 'http://127.0.0.1:8081/usvn/svn/test/trunk' ； 前缀为：'http://172.16.50.117:8081/usvn/svn/'
SVN_BRANCH      ： svn分支：如svn地址为 'http://127.0.0.1:8081/usvn/svn/test/trunk' ； 分支为：'trunk'
SVN_LOCA_PATH   ： 本地同步源目录  默认为：'/data/salt/salt/deploy/files/'
SVN_USER        ： svn 拉取代码所用用户名
SVN_PASSWD      ： svn 拉取代码所用密码
SVN_CMD         ： svn命令路径 默认： '/usr/bin/svn'
SVN_TARGET_PATH ： 远端同步路径  默认：'/data/app/'


SHOW_DEPLOY_LOGS_NUM ：显示历史发布记录条数 默认：5
SHOW_SVN_LOGS_NUM =  ：显示svn历史提交记录条数 默认：5

PHP_MODE = 'apache'  ：php项目类型目录及文件所属者
PHP_ROOT = '/www'    ：php项目root路径； 列项目名称为 test的php类型项目； 远端路径为 SVN_TARGET_PATH + 项目名称 + PHP_ROOT ；/data/app/test/www
# -*- coding: utf-8 -*-

DEBUG = True
SQLALCHEMY_TRACK_MODIFICATIONS = True
CSRF_ENABLED = True
SECRET_KEY = 'asdfghjkl'
SQLALCHEMY_POOL_SIZE = 100
SQLALCHEMY_POOL_RECYCLE = 10
SQLALCHEMY_POOL_TIMEOUT = 3000
SQLALCHEMY_DATABASE_URI = 'mysql://user:passwd@127.0.0.1:3306/laas'


SALT_API_ADDR = "127.0.0.1"
SALT_API_PROT = '58080'
SALT_API_USER = 'salt'
SALT_API_PASSWD = 'salt'

SVN_ADDR = 'http://127.0.0.1:8081/usvn/svn/'
SVN_BRANCH = 'trunk'
SVN_LOCA_PATH = '/data/salt/salt/deploy/files/'
SVN_USER = 'user'
SVN_PASSWD = 'passwd'
SVN_CMD = '/usr/bin/svn'
SVN_TARGET_PATH = '/data/app/'


SHOW_DEPLOY_LOGS_NUM = 5
SHOW_SVN_LOGS_NUM = 10

PHP_MODE = 'apache'
PHP_ROOT = '/www'



SALT_CMD_EXCLUDE = 'rm,mkfs,dd,halt,reboot,shutdown,poweroff,init'

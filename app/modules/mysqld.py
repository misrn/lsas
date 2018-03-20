# -*- coding: utf-8 -*-
from app import db
import time

#unique 如果为True 则不能出现重复的值
#primary_key 表示主键
#index 为True 创建索引
#nullable 如果为True 允许使用空值
#default 设置默认值

# 主机列表
class Hosts(db.Model):
    __tablename__ = 'hosts'
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    hostname = db.Column(db.String(255), unique=False, nullable=False)  # 主机名
    os = db.Column(db.String(255), unique=False, nullable=False)  # 服务器发行版本
    osrelease = db.Column(db.String(255), unique=False, nullable=False)  # 服务器版本
    kernelrelease = db.Column(db.String(255), unique=False, nullable=False)  # 内核版本
    selinux = db.Column(db.String(255), unique=False, nullable=False)  # selinux状态
    status = db.Column(db.Integer(), unique=False, nullable=False)  # 主机状态
    mem_total = db.Column(db.Integer(), unique=False, nullable=False)  # 内存大小（单位M）
    num_cpus = db.Column(db.Integer(), unique=False, nullable=False)  # cpu核数
    add_time = db.Column(db.DateTime(), unique=False,nullable=False)  # 添加时间
    up_time = db.Column(db.DateTime(), unique=False,nullable=True)  # 更新时间

    def __init__(self, hostname, os, osrelease,kernelrelease,selinux,status,mem_total,num_cpus):
        self.hostname = hostname
        self.os = os
        self.osrelease = osrelease
        self.kernelrelease = kernelrelease
        self.selinux = selinux
        self.status = status
        self.mem_total = mem_total
        self.num_cpus = num_cpus
        self.add_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())




# 用户表
class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=False)  # 用户名
    passwd = db.Column(db.String(255), unique=False, nullable=False)  # 密码
    active = db.Column(db.Integer(), nullable=False, default=0)  # 账户状态
    add_time = db.Column(db.DateTime(), nullable=False)  # 注册时间
    login_time = db.Column(db.DateTime(), nullable=True)  # 最近一次登录时间
    full_name = db.Column(db.String(255), nullable=False)  # 姓名

    def __init__(self, username, passwd, full_name):
        self.username = username
        self.passwd = passwd
        self.active = 0
        self.add_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.full_name = full_name

    def is_active(self):
        if int(self.active) == 1:
            return True
        else:
            return False

    def get_id(self):
        return unicode(self.id)

    def is_authenticated(self):
        return True

    def is_anonymous(self):
        return False

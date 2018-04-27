# -*- coding: utf-8 -*-
from app import db
import time


# unique 如果为True 则不能出现重复的值
# primary_key 表示主键
# index 为True 创建索引
# nullable 如果为True 允许使用空值
# default 设置默认值

# 角色表
class Roles(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    role_name = db.Column(db.String(255), unique=False, nullable=False)  # 角色名称
    create_time = db.Column(db.DateTime(), unique=False, nullable=True)  # 创建时间
    role_text = db.Column(db.String(255), unique=False, nullable=False)  # 角色标签

    def __init__(self, role_name, role_text):
        self.role_name = role_name
        self.create_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.role_text = role_text


# 操作日志表
class Operation_logs(db.Model):
    __tablename__ = 'operation_logs'
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    user = db.Column(db.String(255), unique=False, nullable=False)  # 用户
    type = db.Column(db.String(255), unique=False, nullable=False)  # 类型
    time = db.Column(db.DateTime(), unique=False, nullable=True)  # 时间
    tex = db.Column(db.String(255), unique=False, nullable=False)  # 项目类型

    def __init__(self, type, tex, user):
        self.user = user
        self.time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.type = type
        self.tex = tex


# 项目表
class Project(db.Model):
    __tablename__ = 'project'
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    project_name = db.Column(db.String(255), unique=False, nullable=False)  # 项目名称
    add_time = db.Column(db.DateTime(), unique=False, nullable=False)  # 添加时间
    up_time = db.Column(db.DateTime(), unique=False, nullable=True)  # 更新时间
    pre_version = db.Column(db.Integer(), unique=False, nullable=False)  # 预发布版本号
    pro_version = db.Column(db.Integer(), unique=False, nullable=False)  # 生产版本号
    type = db.Column(db.String(255), unique=False, nullable=False)  # 项目类型
    svn_addr = db.Column(db.String(255), unique=False, nullable=False)  # SVN地址
    app_path = db.Column(db.String(255), unique=False, nullable=False)  # 部署路径
    loca_path = db.Column(db.String(255), unique=False, nullable=False)  # 本地路径
    pre_hosts = db.Column(db.String(255), unique=False, nullable=False)  # 预发布服务器地址
    pro_hosts = db.Column(db.String(255), unique=False, nullable=False)  # 生产服务器地址

    def __init__(self, project_name, type, svn_addr, app_path, loca_path, pre_hosts, pro_hosts):
        self.project_name = project_name
        self.add_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.type = type
        self.svn_addr = svn_addr
        self.app_path = app_path
        self.loca_path = loca_path
        self.pre_hosts = pre_hosts
        self.pro_hosts = pro_hosts


# 代码发布日志表
class Deploy_logs(db.Model):
    __tablename__ = 'deploy_logs'
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    deploy_user = db.Column(db.String(255), unique=False, nullable=False)  # 发布用户
    deploy_project_id = db.Column(db.Integer(), unique=False, nullable=False)  # 项目ID
    deploy_version = db.Column(db.Integer(), unique=False, nullable=False)  # 发布版本
    deploy_time = db.Column(db.DateTime(), unique=False, nullable=True)  # 发布时间
    deploy_txt = db.Column(db.Text(), unique=False, nullable=False)  # 发布备注

    def __init__(self, deploy_txt, deploy_version, deploy_user, deploy_project_id):
        self.deploy_txt = deploy_txt
        self.deploy_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.deploy_version = deploy_version
        self.deploy_user = deploy_user
        self.deploy_project_id = deploy_project_id


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
    add_time = db.Column(db.DateTime(), unique=False, nullable=False)  # 添加时间
    up_time = db.Column(db.DateTime(), unique=False, nullable=True)  # 更新时间
    eth0_ipaddr = db.Column(db.String(255), unique=False, nullable=False)  # eth0网卡IP地址

    def __init__(self, hostname, os, osrelease, kernelrelease, selinux, status, mem_total, num_cpus, eth0_ipaddr):
        self.hostname = hostname
        self.os = os
        self.osrelease = osrelease
        self.kernelrelease = kernelrelease
        self.selinux = selinux
        self.status = status
        self.mem_total = mem_total
        self.num_cpus = num_cpus
        self.eth0_ipaddr = eth0_ipaddr
        self.add_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


# 用户表
class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer(), primary_key=True, nullable=False)

    passwd = db.Column(db.String(255), unique=False, nullable=False)  # 密码
    active = db.Column(db.Integer(), nullable=False, default=0)  # 账户状态
    add_time = db.Column(db.DateTime(), nullable=False)  # 注册时间
    login_time = db.Column(db.DateTime(), nullable=True)  # 最近一次登录时间
    full_name = db.Column(db.String(255), nullable=False)  # 姓名
    role_id = db.Column(db.Integer(), nullable=True) # 角色ID
    email = db.Column(db.String(255), nullable=False)  # 邮箱


    def __init__(self, passwd, full_name,role_id,email):
        self.email=email
        self.passwd = passwd
        self.active = 0
        self.add_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.full_name = full_name
        self.role_id = role_id

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

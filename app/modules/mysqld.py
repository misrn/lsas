# -*- coding: utf-8 -*-
from app import db
import time


# 用户表
class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=False)  # 用户名
    passwd = db.Column(db.String(255), unique=False, nullable=False)  # 密码
    active = db.Column(db.Integer(), nullable=False, default=0)  # 账户状态
    add_time = db.Column(db.DateTime(), nullable=False, default="")  # 注册时间
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

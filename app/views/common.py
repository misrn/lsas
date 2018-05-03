# -*- coding: utf-8 -*-
from flask import Blueprint, render_template, flash, session, g, request, redirect, url_for ,jsonify
from flask_login import login_required ,current_user ,logout_user,login_user
from app.modules import  mysqld
from app.modules import  femail
from app.modules import salt
from app.modules.salt import *
from app.modules.file import *
from app.modules.mysqld import *
from app.modules.femail import *
from app import login_manager, app
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import json
import pysvn
from datetime import date, datetime
import string
import random
import redis

#用户加载回调
@login_manager.user_loader
def load_user(id):
    user = mysqld.Users.query.get(int(id))
    return user

#每次请求都运行
@app.before_request
def before_request():
    g.user = current_user

def Json_Unicode_To_Uft8(input):
    if isinstance(input, dict):
        return {Json_Unicode_To_Uft8(key): Json_Unicode_To_Uft8(value) for key, value in input.iteritems()}
    elif isinstance(input, list):
        return [Json_Unicode_To_Uft8(element) for element in input]
    elif isinstance(input, unicode):
        return input.encode('utf-8')
    else:
        return input

class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        # if isinstance(obj, datetime.datetime):
        #     return int(mktime(obj.timetuple()))
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, obj)

def svn_login(*args):
    return True, app.config["SVN_USER"], app.config["SVN_PASSWD"], False

def Svn_logs(url):  # svn信息函数
    client = pysvn.Client()
    client.callback_get_login = svn_login
    return client.log(url, limit=app.config["SHOW_SVN_LOGS_NUM"], strict_node_history=True, discover_changed_paths=True, )

#写入日志
def logs(type,tex):
    try:
        data = mysqld.Operation_logs(
            user=g.user.full_name,
            type=type,
            tex=tex
        )
        db.session.add(data)
        db.session.commit()
    except Exception,error:
        print str(error)

def user_jurisdiction(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        key = session.get("Jurisdiction")
        r = redis.Redis(host=app.config['REDIS_ADDR'], port=app.config['REDIS_PROT'],db=app.config['REDIS_DB'],password=app.config['REDIS_PASSWD'])
        if r.exists(key):
            r.expire(key,60*60)
            for i in r.get(session.get("Jurisdiction")).split(","):
                if i == request.path[1:].replace("/","."):
                    return func(*args, **kwargs)
            return json.dumps({"code": -1, "msg": u"权限拒绝!", "data": ""}, cls=MyEncoder)
        else:
            return json.dumps({"code": -1, "msg": u"登录超时请重新登录!", "data": ""}, cls=MyEncoder)
    return decorated_view
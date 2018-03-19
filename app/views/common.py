# -*- coding: utf-8 -*-
from flask import Blueprint, render_template, flash, session, g, request, redirect, url_for ,jsonify
from flask_login import login_required ,current_user ,logout_user,login_user
from app.modules import  mysqld
from app.modules import salt
from app.modules.salt import *
from app.modules.mysqld import *
from app import login_manager, app
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import json

#用户加载回调
@login_manager.user_loader
def load_user(id):
    user = mysqld.Users.query.get(int(id))
    return user

#每次请求都运行
@app.before_request
def before_request():
    g.user = current_user

# 返回json
def rep_json(status):
    data = {
        "status": status
    }
    return json.dumps(data)

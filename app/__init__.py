# -*- coding: utf-8 -*-
from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from werkzeug.contrib.cache import SimpleCache

# 初始化Flask
app = Flask(__name__)

# 配置
app.config.from_pyfile('config/config.py')

# 初始化数据库实列
db = SQLAlchemy(app)

# 登录管理
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

# 初始化缓存，内存缓存，重启失效
cache = SimpleCache()

# 注册蓝图
from views import auth, index, register, sys, assets, salt,deploy

app.register_blueprint(sys.sys, url_prefix='/sys')
app.register_blueprint(salt.salt, url_prefix='/salt')
app.register_blueprint(auth.auth, url_prefix='/auth')
app.register_blueprint(assets.assets, url_prefix='/assets')
app.register_blueprint(deploy.deploy, url_prefix='/deploy')
app.register_blueprint(register.register, url_prefix='/register')
app.register_blueprint(index.index_url)

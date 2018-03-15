# -*- coding: utf-8 -*-
from app.views.common import *

# 定义蓝图
register = Blueprint('register', __name__)

# 注册模块
@register.route('/', methods=["GET", "POST"])
def index():
    if request.method == 'POST':
        username = request.form['form-username']
        passwd = request.form['form-password']
        confirm_password = request.form['confirm-password']
        g.request_name=username
        g.request_passwd=passwd
        g.request_confirm_password=confirm_password
        user = db.session.query(User).filter_by(username=username).first()  # 查询用户信息
        if user is None:
            if passwd  != confirm_password:
                flash(u'两次密码输入不一致!')
            else:
                UserInfo = mysqld.User(
                    username=username,
                    passwd=generate_password_hash(passwd)
                )
                db.session.add(UserInfo)
                db.session.commit()
                flash(u'注册成功,请登录!')
        else:
            flash(u'用户名已存在!')

    return render_template("register/index.html")

# -*- coding: utf-8 -*-
from app.views.common import *

# 定义蓝图
register = Blueprint('register', __name__)


# 登录模块
@register.route('/', methods=["GET", "POST"])
def index():
    if request.method == 'POST':
        username = request.form['form-username']
        passwd = request.form['form-password']
        confirm_password = request.form['confirm-password']
        full_name = request.form['form-full_name']
        g.request_name = username
        g.request_passwd = passwd
        g.request_confirm_password = confirm_password
        g.full_name = full_name
        user = db.session.query(Users).filter_by(username=username).first()  # 查询用户信息
        if user is None:
            if passwd != confirm_password:
                flash(u'两次密码输入不一致!')
            else:
                UserInfo = mysqld.Users(
                    username=username,
                    passwd=generate_password_hash(passwd),
                    full_name=full_name
                )
                db.session.add(UserInfo)
                db.session.commit()
                flash(u'注册成功,请登录!')
        else:
            flash(u'用户名已存在!')

    return render_template("register/index.html")

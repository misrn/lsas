# -*- coding: utf-8 -*-
from app.views.common import *
import json

# 定义蓝图
auth = Blueprint('auth', __name__)


# 登录模块
@auth.route('/login', methods=["GET", "POST"])
def login():
    if g.user.is_authenticated:  # 判断用户是否已经登录
        return redirect(url_for('index.index'))
    if request.method == 'POST':
        username = request.form['form-username']
        passwd = request.form['form-password']
        g.auth_username = username
        user = db.session.query(Users).filter_by(username=username).first()  # 查询用户信息
        if user is None or check_password_hash(user.passwd, passwd) == False:
            flash(u'用户名/密码错误!')
        elif user.is_active() == False:
            flash(u'该账户未激活!')
        else:
            login_user(user)
            # 记录最后一次登录时间
            UserInfo = Users.query.get(user.id)
            UserInfo.login_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
            db.session.commit()
            return redirect(url_for('index.index'))
    return render_template("auth/index.html")


# 登出模块
@auth.route('/logout')
@login_required  # 登录保护
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

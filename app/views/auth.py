# -*- coding: utf-8 -*-
from app.views.common import *

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
        user = db.session.query(User).filter_by(username=username).first()  # 查询用户信息
        if user is None or check_password_hash(user.passwd, passwd) == False:
            flash(u'用户名/密码错误!')
        elif user.is_active() == False:
            flash(u'该账户未激活!')
        else:
            login_user(user)
            return redirect(url_for('index.index'))
    return render_template("auth/index.html")


# 登出模块
@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

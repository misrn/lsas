# -*- coding: utf-8 -*-
from app.views.common import *
import json
from sqlalchemy import desc , extract,or_

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
        user = Users.query.filter(or_(Users.full_name==username,Users.email==username)).first()  # 查询用户信息
        if user is None or check_password_hash(user.passwd, passwd) == False:
            flash(u'用户名/密码错误!')
        elif user.is_active() == False:
            flash(u'该账户未激活!')
        else:
            try:
                login_user(user)
                #获取用户角色权限
                Jurisdiction = Roles.query.get(user.role_id).jurisdiction
                key = ''.join(random.sample(string.ascii_letters + string.digits, 15))
                r = redis.Redis(host=app.config['REDIS_ADDR'], port=app.config['REDIS_PROT'],db=app.config['REDIS_DB'],password=app.config['REDIS_PASSWD'])
                r.set(key, Jurisdiction)
                session['Jurisdiction']=key
                UserInfo = Users.query.get(user.id)
                UserInfo.login_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                db.session.commit()
                return redirect(url_for('index.index'))
            except Exception,e:
                print str(e)
                flash(u'登录异常!')

    return render_template("auth/index.html")


# 登出模块
@auth.route('/logout')
@login_required  # 登录保护
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

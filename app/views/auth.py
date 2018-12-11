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
        UserName = request.form['form-username']
        g.auth_username = UserName
        QueryData = Users.query.filter(or_(Users.full_name == UserName, Users.email == UserName)).first()  # 查询用户信息
        if QueryData is None or check_password_hash(QueryData.passwd, request.form['form-password']) == False:
            flash(u'用户名/密码错误!')
        elif QueryData.is_active() == False:
            flash(u'该账户未激活!')
        else:
            try:
                login_user(QueryData)
                Jurisdiction = Roles.query.get(QueryData.role_id).jurisdiction  # 获取用户角色权限
                RedisKey = ''.join(random.sample(string.ascii_letters + string.digits, 15))
                session['Jurisdiction'] = RedisKey
                Redisd.Set(RedisKey, Jurisdiction ,86400)
                QueryData.login_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                db.session.commit()
                return redirect(url_for('index.index'))
            except Exception, Err:
                print str(Err)
                flash(u'登录异常!')
    return render_template("auth/index.html")


# 登出模块
@auth.route('/logout')
@login_required  # 登录保护
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

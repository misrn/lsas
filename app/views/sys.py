# -*- coding: utf-8 -*-
from app.views.common import *

# 定义蓝图
sys = Blueprint('sys', __name__)


# user 用户管理模块
@sys.route('/users', methods=["GET", "POST"])
@login_required  # 登录保护
def users():
    g.UserInfo = db.session.query(Users).all()  # 查询所有用户信息
    return render_template("sys/users.html")


# 禁用/启用 用户模块
@sys.route('/users_mg', methods=["GET", "POST"])
@login_required  # 登录保护
def users_mg():
    if request.method == 'POST':
        user_id = request.form['user_id']  # 用户ID
        operation = request.form['operation']  # 操作
        UserInfo = Users.query.get(user_id)
        if operation == "disable":
            UserInfo.active = 0
        elif operation == "enable":
            UserInfo.active = 1
        elif operation == "del":
            db.session.delete(UserInfo)
        else:
            UserInfo.active = 2
        db.session.commit()
    return rep_json("操作成功")

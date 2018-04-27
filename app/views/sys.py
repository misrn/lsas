# -*- coding: utf-8 -*-
from app.views.common import *
import pinyin

# 定义蓝图
sys = Blueprint('sys', __name__)


# user 用户管理模块
@sys.route('/users', methods=["GET", "POST"])
@login_required  # 登录保护
def users():
    return render_template("sys/users.html")


# 禁用/启用 用户模块
@sys.route('/users_mg', methods=["GET", "POST"])
@login_required  # 登录保护
def users_mg():
    if request.method == 'POST':
        action = request.form['action']
        if action == "list":
            var = []
            for user in db.session.query(Users).all():
                try:
                    role = Roles.query.get(user.role_id).role_name
                except:
                    role = "未绑定角色"
                var.append({
                     "active": user.active, "add_time": user.add_time,"id":user.id,"email":user.email,
                    "login_time": user.login_time,"full_name": user.full_name, "role": role
                    })
            return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": var}, cls=MyEncoder)

        if action == "del":
            try:
                db.session.delete(Users.query.get(request.form['id']))
                db.session.commit()
                return json.dumps({"code": 1, "msg": u"删除用户成功!", "data": ""}, cls=MyEncoder)
            except:
                return json.dumps({"code": -1, "msg": u"删除用户失败!", "data": ""}, cls=MyEncoder)

        if action == "add":
            user_email = request.form['user_email']
            user_name = request.form['user_name']
            user_role = request.form['user_role']

            user = db.session.query(Users).filter_by(email=user_email).first()  # 查询用户信息
            if user is None:
                passwd = ''.join(random.sample(string.ascii_letters + string.digits, 8))
                UserInfo = mysqld.Users(
                    email=user_email,
                    role_id=user_role,
                    passwd=generate_password_hash(passwd),
                    full_name=user_name,
                )
                db.session.add(UserInfo)
                db.session.commit()
                content = u"""
                <p>登录邮箱：%s</p>
                <p>请牢记你的密码：<strong>%s</strong></p>
                """ %(user_email,passwd)
                send_mail(user_email,u"运维平台账号密码通知",content)
                return json.dumps({"code": 1, "msg": u"添加成功!", "data": ""}, cls=MyEncoder)
            else:
                return json.dumps({"code": -1, "msg": u"邮箱地址重复!", "data": ""}, cls=MyEncoder)
        else:
            return json.dumps({"code": -1, "msg": u"未知方法", "data": ""})

    try:
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
        return rep_json(1, u"操作成功", "")
    except:
        return rep_json(-1, u"操作失败", "")


@sys.route('/role', methods=["GET", "POST"])
@login_required  # 登录保护
def role():
    return render_template("sys/role.html")


@sys.route('/role_mg', methods=["GET", "POST"])
@login_required  # 登录保护
def role_mg():
    if request.method == 'POST':
        action = request.form['action']
        if action == "list":
            try:
                var = []
                for i in db.session.query(Roles).all():
                    var.append(
                        {"role_name": i.role_name, "create_time": i.create_time, "role_text": i.role_text, "id": i.id})
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": var}, cls=MyEncoder)
            except:
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})
        elif action == "add":
            try:
                role_text = request.form['role_text']
                role_name = request.form['role_name']
                if db.session.query(Roles).filter_by(role_text=role_text).first() is not None:
                    return json.dumps({"code": -1, "msg": u"角色标签重复!", "data": ""})
                elif db.session.query(Roles).filter_by(role_name=role_name).first() is not None:
                    return json.dumps({"code": -1, "msg": u"角色名称重复!", "data": ""})
                else:
                    data = mysqld.Roles(
                        role_text=role_text,
                        role_name=role_name
                    )
                    db.session.add(data)
                    db.session.commit()
                    return json.dumps({"code": 1, "msg": u"添加角色成功", "data": ""})
            except:
                return json.dumps({"code": -1, "msg": u"添加角色失败", "data": ""})

        elif action == "del":
            try:
                db.session.delete(Roles.query.get(request.form['id']))
                db.session.commit()
                return json.dumps({"code": 1, "msg": u"删除角色成功", "data": ""})
            except:
                return json.dumps({"code": -1, "msg": u"删除角色失败", "data": ""})

        elif action == "edit":
            try:
                role_text = request.form['role_text']
                role_name = request.form['role_name']
                Role = Roles.query.get(request.form['id'])
                Role.role_text = role_text
                Role.role_name = role_name
                db.session.commit()
                return json.dumps({"code": 1, "msg": u"编辑角色成功", "data": ""})
            except:
                return json.dumps({"code": -1, "msg": u"编辑角色失败", "data": ""})

        else:
            return json.dumps({"code": -1, "msg": u"未知方法", "data": ""})
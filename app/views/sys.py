# -*- coding: utf-8 -*-
from app.views.common import *

# 定义蓝图
sys = Blueprint('sys', __name__)

# 修改密码
@sys.route('/repasswd', methods=["GET", "POST"])
@login_required  # 登录保护
@user_jurisdiction
def repasswd():
    if request.method == 'POST':
        try:

            UserInfo = Users.query.get(request.form['id'])
            if check_password_hash(UserInfo.passwd, request.form['original_passwd']) == False:
                return json.dumps({"code": -1, "msg": u"原始密码错误!", "data": ""}, cls=MyEncoder)
            else:
                UserInfo.passwd = generate_password_hash(request.form['new_passwd'])
                db.session.commit()
                logs("repasswd",u"修改密码成功!")
                return json.dumps({"code": 1, "msg": u"密码修改成功!", "data": ""}, cls=MyEncoder)
        except Exception,error:
            print str(error)
            logs("repasswd",u"修改密码失败!")
            return json.dumps({"code": -1, "msg": u"密码修改失败!", "data": ""}, cls=MyEncoder)

# 用户管理html模块
@sys.route('/users', methods=["GET", "POST"])
@login_required  # 登录保护
def users():
    return render_template("sys/users.html")

# 用户管理
@sys.route('/users_mg', methods=["GET", "POST"])
@login_required  # 登录保护
@user_jurisdiction
def users_mg():
    if request.method == 'POST':
        action = request.form['action']
        if action == "list":
            try:
                var = []
                for user in db.session.query(Users).all():
                    try:
                        role = Roles.query.get(user.role_id).role_name
                    except:
                        role = "未绑定角色"
                    var.append({
                         "active": user.active, "add_time": user.add_time,"id":user.id,"email":user.email,
                        "login_time": user.login_time,"full_name": user.full_name, "role": role,"role_id":user.role_id
                        })
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": var}, cls=MyEncoder)
            except Exception,error:
                print str(error)
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""}, cls=MyEncoder)

        if action == "del":
            try:
                id = request.form['id']
                User=Users.query.get(id)
                db.session.delete(User)
                db.session.commit()
                logs("users_mg.del",u"删除用户成功，用户ID:%s"%(id))
                return json.dumps({"code": 1, "msg": u"删除用户成功!", "data": ""}, cls=MyEncoder)
            except Exception,error:
                print str(error)
                return json.dumps({"code": -1, "msg": u"删除用户失败!", "data": ""}, cls=MyEncoder)

        if action == "add":
            try:
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
                    logs("users_mg.add",u"新增用户成功，用户名："+user_name)
                    return json.dumps({"code": 1, "msg": u"新增用户成功!", "data": ""}, cls=MyEncoder)
                else:
                    logs("users_mg.add",u"新增用户失败,邮箱地址重复!")
                    return json.dumps({"code": -1, "msg": u"新增用户失败,邮箱地址重复!", "data": ""}, cls=MyEncoder)
            except Exception,error:
                print str(error)
                return json.dumps({"code": -1, "msg": u"新增用户失败!", "data": ""}, cls=MyEncoder)

        if action =="edit":
            try:
                UserInfo = Users.query.get(request.form['id'])
                UserInfo.role_id=request.form['user_role']
                UserInfo.full_name=request.form['user_name']
                UserInfo.email=request.form['user_email']
                UserInfo.active=request.form['active']
                db.session.commit()
                logs("users_mg.edit",u"编辑用户成功,用户ID:%s"%(request.form['id']))
                return json.dumps({"code": 1, "msg": u"编辑成功!", "data": ""}, cls=MyEncoder)
            except:
                return json.dumps({"code": -1, "msg": u"编辑失败!", "data": ""}, cls=MyEncoder)

        else:
            return json.dumps({"code": -1, "msg": u"未知方法", "data": ""})

# 角色管理html模块
@sys.route('/role', methods=["GET", "POST"])
@login_required  # 登录保护
def role():
    return render_template("sys/role.html")

#角色管理
@sys.route('/role_mg', methods=["GET", "POST"])
@login_required  # 登录保护
@user_jurisdiction
def role_mg():
    if request.method == 'POST':
        action = request.form['action']
        if action == "listjdc":
            try:
                role_not_jdc = []
                role_jdc = []
                info = Roles.query.get(request.form['id']).jurisdiction
                for i in db.session.query(Jurisdiction).all():
                    if i.jurisdiction_text not in info.split(','):
                        role_not_jdc.append({"jurisdiction_name": i.jurisdiction_name, "id": i.id, "jurisdiction_text":i.jurisdiction_text})
                    else:
                        role_jdc.append({"jurisdiction_name": i.jurisdiction_name, "id": i.id, "jurisdiction_text":i.jurisdiction_text})
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "role_jdc": role_jdc,"role_not_jdc":role_not_jdc}, cls=MyEncoder)
            except Exception,error:
                print str(error)
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})
        if action == "jdcadd":
            try:
                jurisdiction_text = request.form['jurisdiction_text']
                info = Roles.query.get(request.form['id'])
                if info.jurisdiction == "":
                    info.jurisdiction = jurisdiction_text
                else:
                    info.jurisdiction = info.jurisdiction+','+jurisdiction_text
                db.session.commit()
                logs("role_mg.jdcadd",u"角色名：%s 新增 %s 权限成功!" %(info.role_name,jurisdiction_text))
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": ""}, cls=MyEncoder)
            except Exception,error:
                print str(error)
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""}, cls=MyEncoder)
        if action == "jdcdel":
            try:
                info = Roles.query.get(request.form['id'])
                a = ','.join(filter(lambda x: x != request.form['jurisdiction_text'], info.jurisdiction.split(',')))
                info.jurisdiction = a
                db.session.commit()
                logs("role_mg.jdcdel",u"角色名：%s 删除 %s 权限成功!" %(info.role_name,request.form['jurisdiction_text']))
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": ""}, cls=MyEncoder)
            except Exception,error:
                print str(error)
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""}, cls=MyEncoder)
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
                    logs("role_mg.add",u"添加角色成功，角色名称：%s"%(role_name))
                    return json.dumps({"code": 1, "msg": u"添加角色成功", "data": ""})
            except Exception,error:
                print str(error)
                logs("role_mg.add",u"添加角色失败!")
                return json.dumps({"code": -1, "msg": u"添加角色失败", "data": ""})
        elif action == "del":
            try:
                db.session.delete(Roles.query.get(request.form['id']))
                db.session.commit()
                logs("role_mg.del",u"删除角色成功，角色ID：%s"%(request.form['id']))
                return json.dumps({"code": 1, "msg": u"删除角色成功", "data": ""})
            except Exception,error:
                print str(error)
                return json.dumps({"code": -1, "msg": u"删除角色失败", "data": ""})
        elif action == "edit":
            try:
                role_text = request.form['role_text']
                role_name = request.form['role_name']
                Role = Roles.query.get(request.form['id'])
                Role.role_text = role_text
                Role.role_name = role_name
                db.session.commit()
                logs("role_mg.edit",u"编辑角色成功,角色ID:%s" %(request.form['id']))
                return json.dumps({"code": 1, "msg": u"编辑角色成功", "data": ""})
            except Exception,error:
                print str(error)
                return json.dumps({"code": -1, "msg": u"编辑角色失败", "data": ""})
        else:
            return json.dumps({"code": -1, "msg": u"未知方法", "data": ""})

#权限列表html管理
@sys.route('/jurisdiction', methods=["GET", "POST"])
@login_required  # 登录保护
def jurisdiction():
    return render_template("sys/jurisdiction.html")

#权限管理
@sys.route('/jurisdiction_mg', methods=["GET", "POST"])
@login_required  # 登录保护
@user_jurisdiction
def jurisdiction_mg():
    if request.method == 'POST':
        action = request.form['action']
        if action == "list":
            try:
                var = []
                for i in db.session.query(Jurisdiction).all():
                    var.append(
                        {"jurisdiction_name": i.jurisdiction_name, "add_time": i.add_time, "describe": i.describe, "id": i.id, "jurisdiction_text":i.jurisdiction_text})
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": var}, cls=MyEncoder)
            except Exception,error:
                print str(error)
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})

        elif action == "add":
            try:
                jurisdiction_text = request.form['jurisdiction_text']
                jurisdiction_name = request.form['jurisdiction_name']
                describe = request.form['describe']
                if db.session.query(Jurisdiction).filter_by(jurisdiction_text=jurisdiction_text).first() is not None:
                    return json.dumps({"code": -1, "msg": u"权限标签重复!", "data": ""})
                elif db.session.query(Jurisdiction).filter_by(jurisdiction_name=jurisdiction_name).first() is not None:
                    return json.dumps({"code": -1, "msg": u"权限名称重复!", "data": ""})
                else:
                    data = mysqld.Jurisdiction(
                        jurisdiction_text=jurisdiction_text,
                        jurisdiction_name=jurisdiction_name,
                        describe=describe
                    )
                    db.session.add(data)
                    db.session.commit()
                    logs("jurisdiction_mg.add",u"添加权限信息成功，权限名称:%s"%(jurisdiction_name))
                    return json.dumps({"code": 1, "msg": u"添加权限信息成功", "data": ""})
            except Exception,error:
                print str(error)
                return json.dumps({"code": -1, "msg": u"添加权限信息失败", "data": ""})

        elif action == "del":
            try:
                JurisdictionInfo = Jurisdiction.query.get(request.form['id'])
                Role = Roles.query.filter(Roles.jurisdiction.like("%" + JurisdictionInfo.jurisdiction_text + "%")).first()
                if Role is not None:
                    return json.dumps({"code": -1, "msg": u"角色[%s]拥有该权限，不允许删除!"%(Role.role_name), "data": ""})
                else:
                    db.session.delete(JurisdictionInfo)
                    db.session.commit()
                    logs("jurisdiction_mg.del",u"删除权限信息成功，权限ID:%s"%(request.form['id']))
                    return json.dumps({"code": 1, "msg": u"删除权限信息成功!", "data": ""})
            except Exception,error:
                print str(error)
                return json.dumps({"code": -1, "msg": u"删除权限信息失败!", "data": ""})

        elif action == "edit":
            try:
                jdc = Jurisdiction.query.get(request.form['id'])
                jdc.jurisdiction_name = request.form['jurisdiction_name']
                jdc.describe = request.form['describe']
                db.session.commit()
                logs("jurisdiction_mg.edit",u"编辑权限信息成功，权限ID:%s"%(request.form['id']))
                return json.dumps({"code": 1, "msg": u"编辑权限信息成功!", "data": ""})
            except Exception,error:
                print str(error)
                return json.dumps({"code": -1, "msg": u"编辑权限信息成功!", "data": ""})

        else:
            return json.dumps({"code": -1, "msg": u"未知方法", "data": ""})
# -*- coding: utf-8 -*-
from app.views.common import *

# 定义蓝图
host = Blueprint('host', __name__)


# HTML模块
@host.route('/file', methods=["GET", "POST"])
def file():
    return render_template("host/file.html")


@host.route('/filemg', methods=["GET", "POST"])
@login_required  # 登录保护
@user_jurisdiction
def filemg():
    if request.method == 'POST':
        action = request.form['action']
        if action == "list":
            try:
                data = []
                for file in db.session.query(Files).all():
                    data.append({"id": file.id, "file_name": file.file_name, "salt_mode": file.salt_mode,
                                 "create_time": file.create_time, "up_time": file.up_time})
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": data}, cls=MyEncoder)
            except Exception as error:
                print(str(error))
                return json.dumps({"code": 1, "msg": u"请求数据失败!", "data": ""}, cls=MyEncoder)
        elif action == "showtxt":
            Data = Files.query.get(request.form['id'])
            return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": Data.file_txt}, cls=MyEncoder)

        elif action == "listhosts":  # 请求所有主机
            try:
                VHost = []
                data = Files.query.get(request.form['id'])
                for i in data.lnhosts.split(','):
                    VHost.append(i)
                var = []
                for i in db.session.query(Hosts).all():
                    if i.hostname in VHost:
                        var.append({"hostname": i.hostname, "enable": "true"})
                    else:
                        var.append({"hostname": i.hostname, "enable": "false"})
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": var})
            except:
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})
        elif action == "uphost":
            try:
                data = Files.query.get(request.form['id'])
                data.lnhosts = request.form['Hosts']
                db.session.commit()
                return json.dumps({"code": 1, "msg": u"更新数据成功!", "data": ""})
            except Exception as error:
                print(str(error))
                return json.dumps({"code": -1, "msg": u"更新数据失败!", "data": ""})
        elif action == "push":
            try:
                data = Files.query.get(request.form['id'])
                salt = saltAPI(host=app.config['SALT_API_ADDR'], user=app.config['SALT_API_USER'],
                               password=app.config['SALT_API_USER'], prot=app.config['SALT_API_PROT'])
                ReturnDate = []
                for host in data.lnhosts.split(','):
                    info = salt.saltCmd({"fun": "state.sls", "client": "local", "tgt": host, "arg": "%s" % (data.salt_mode)})[0]
                    ReturnDate.append(info)
                InputLog("file.push.%s"%(data.salt_mode),u"新增--推送主机: %s"%(data.lnhosts))
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": ReturnDate})
            except Exception as error:
                print(str(error))
                return json.dumps({"code": 1, "msg": u"系统错误!", "data": " "})

        elif action == "remove":
            try:
                data = Files.query.get(request.form['id'])
                salt = saltAPI(host=app.config['SALT_API_ADDR'], user=app.config['SALT_API_USER'],
                               password=app.config['SALT_API_USER'], prot=app.config['SALT_API_PROT'])
                ReturnDate = []
                for host in data.lnhosts.split(','):
                    info = salt.saltCmd({"fun": "state.sls", "client": "local", "tgt": host, "arg": "%s" % (data.salt_mode.replace('.','.u'))})[0]
                    ReturnDate.append(info)
                InputLog("file.push.%s"%(data.salt_mode),u"卸载--推送主机: %s"%(data.lnhosts))
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": ReturnDate})
            except Exception as error:
                print(str(error))
                return json.dumps({"code": 1, "msg": u"系统错误!", "data": " "})

        elif action == "History_":
            data = Files.query.get(request.form['id'])
            Data = db.session.query(Operation_logs).filter_by(type="file.push.%s"%(data.salt_mode)).all()
            var = []
            for i in Data:
                var.append({"time":i.time,"tex":i.tex})
            return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": var},cls=MyEncoder)
        elif action == "listhall":  # 请求所有主机
            try:
                var = []
                for i in db.session.query(Hosts).all():
                    var.append({"hostname": i.hostname, "enable": "false"})
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": var})
            except:
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})
        elif action == "add":  #
            try:
                data = mysqld.Files(
                    file_name=request.form['FileName'],
                    salt_mode=request.form['SaltMode'],
                    lnhosts=request.form['FileHost']
                )
                db.session.add(data)
                db.session.commit()
                return json.dumps({"code": 1, "msg": u"添加成功!", "data": " "})
            except:
                return json.dumps({"code": -1, "msg": u"添加失败!", "data": ""})

        elif action == "delete":
            try:
                db.session.delete(Files.query.get(request.form['id']))
                db.session.commit()
                return json.dumps({"code": 1, "msg": u"删除成功!", "data": ""})
            except:
                return json.dumps({"code": -1, "msg": u"删除失败!", "data": ""})

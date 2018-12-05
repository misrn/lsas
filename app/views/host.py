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
                    data.append({"id": file.id, "file_name": file.file_name, "file_path": file.file_path, "file_user": file.file_user,
                                     "file_group": file.file_group, "file_node": file.file_node
                                        , "file_txt": file.file_txt, "create_time": file.create_time, "up_time": file.up_time
                                     })
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": data}, cls=MyEncoder)
            except Exception,error:
                print str(error)
                return json.dumps({"code": 1, "msg": u"请求数据失败!", "data": ""}, cls=MyEncoder)
        elif action == "showtxt":
            Data = Files.query.get(request.form['id'])
            return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": Data.file_txt},cls=MyEncoder)

        elif action == "listhosts":  # 请求所有主机
            try:
                var = []
                for i in db.session.query(Hosts).all():
                    var.append({"hostname": i.hostname})
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": var})
            except:
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})

        elif action == "push":
            hosts = request.form['Hosts']
            print id , hosts

            '''
            1 查询出文件内容
            2 生成随机文件名
            3 写入文件内容
            4 随机生成sls文件名
            5 写入sls文件内容
            6 循环主机列表 调用salt api 执行
            7 删除文件
            '''
            data = Files.query.get(request.form['id'])
            dat = '''
%s:
  file.managed:
    - source: salt://file/files/%s
    - template: jinja
    - user: %s
    - group: %s
    - mode: %s
'''%(data.file_path,'7474',data.file_user,data.file_group,data.file_node)

            print data.file_txt

            return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": " "})
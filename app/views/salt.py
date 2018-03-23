# -*- coding: utf-8 -*-
from app.views.common import *

# 定义蓝图
salt = Blueprint('salt', __name__)

@salt.route('/file', methods=["GET", "POST"])
@login_required #登录保护
def file():
    return render_template("salt/file.html")


@salt.route('/filemg', methods=["GET", "POST"])
@login_required #登录保护
def filemg():
    if request.method == 'POST':
        action = request.form['action']
        path = request.form['path']
        path_spl=path.split('/')
        if path_spl[1] != 'data' and path_spl[2]!='salt':
            data = {
                "code": -1,
                "msg":"超出访问权限!",
                "data": False
            }
            return json.dumps(data)
        if action == "listdir":
            items = listdir(path,True)
            if items == False:
                data = {
                    "code": 1,
                    "msg": "数据加载失败!",
                    "data": items
                }
            else:
                data = {
                    "code": 0,
                    "msg": "成功获取文件列表！",
                    "data": items
                }
            return json.dumps(data)
        elif action == "rename":
            newname=request.form["newname"]
            items=rename(path, newname)
            if items == False:
                data = {
                    "code": 1,
                    "msg": "修改失败,目标不存在!",
                    "data": items
                }
            else:
                data = {
                    "code": 0,
                    "msg": "修改成功!",
                    "data": items
                }
            return json.dumps(data)
        elif action == "delete":
            items=delete(path)
            if items == False:
                data = {
                    "code": 1,
                    "msg": "删除失败,不为空/不存在!",
                    "data": items
                }
            else:
                data = {
                    "code": 0,
                    "msg": "删除成功!",
                    "data": items
                }
            return  json.dumps(data)
        elif action == "dadd":
            dname=request.form["dname"]
            items=dadd(path,dname)
            if items == False:
                data = {
                    "code": 1,
                    "msg": "删除失败,目标不存在!",
                    "data": items
                }
            else:
                data = {
                    "code": 0,
                    "msg": "删除成功!",
                    "data": items
                }
            return json.dumps(data)
        elif action == "fadd":
            dname=request.form["dname"]
            items=fadd(path,dname)
            if items == False:
                data = {
                    "code": 1,
                    "msg": "删除失败,目标不存在!",
                    "data": items
                }
            else:
                data = {
                    "code": 0,
                    "msg": "删除成功!",
                    "data": items
                }
            return json.dumps(data)
        elif action == "fopen":
            items=fopen(path)
            if items == False:
                data = {
                    "code": 1,
                    "msg": "读取文件失败!",
                    "data": items
                }
            else:
                data = {
                    "code": 0,
                    "msg": "读取文件成功!",
                    "data": items
                }
            return json.dumps(data)
        elif action == "fsave":
            content=request.form["content"]
            items=fsave(path,content)
            if items == False:
                data = {
                    "code": 1,
                    "msg": "编辑文件失败!",
                    "data": items
                }
            else:
                data = {
                    "code": 0,
                    "msg": "编辑文件成功!",
                    "data": items
                }
            return json.dumps(data)

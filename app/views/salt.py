# -*- coding: utf-8 -*-
from app.views.common import *

# 定义蓝图
salt = Blueprint('salt', __name__)


@salt.route('/file', methods=["GET", "POST"])
@login_required  # 登录保护
def file():
    return render_template("salt/file.html")


@salt.route('/filemg', methods=["GET", "POST"])
@login_required  # 登录保护
def filemg():
    if request.method == 'POST':
        F = File()
        action = request.form['action']
        path = request.form['path']
        path_spl = path.split('/')
        if len(path_spl) <= 2:
            data = {
                "code": -1,
                "msg": "超出访问权限!",
                "data": ""
            }
            return json.dumps(data) 
        if path_spl[1] != 'data' or path_spl[2] != 'salt':
            data = {
                "code": -1,
                "msg": "超出访问权限!",
                "data": ""
            }
            return json.dumps(data)
        if action == "listdir":
            return F.listdir(path, True)
        
        elif action == "rename":
            newname = request.form["newname"]  # 新名称

            return F.rename(path, newname)
        elif action == "delete":
            return F.delete(path)

        elif action == "dadd":
            dname = request.form["dname"]
            return F.dadd(path, dname)

        elif action == "fadd":
            dname = request.form["dname"]
            return F.fadd(path, dname)

        elif action == "fopen":
            return F.fopen(path)

        elif action == "fsave":
            content = request.form["content"]
            return F.fsave(path, content)



@salt.route('/cmd', methods=["GET", "POST"])
@login_required  # 登录保护
def cmd():
    return render_template("salt/cmd.html")


@salt.route('/cmdmg', methods=["GET", "POST"])
@login_required  # 登录保护
def cmdmg():
    if request.method == 'POST':
        action = request.form['action']
        if action == "info":
            path='/data/salt/salt'
            F = File()
            info=F.listdir(path)
            sdata=[]
            for i in json.loads(info)['data']:
                if i["isdir"] == True:
                    finfo=F.listdir(path+'/'+i["name"])
                    for j in json.loads(finfo)['data']:
                        if j['isdir'] == False and j['islnk'] == False:
                            if j["name"] == "init.sls":
                                sdata.append(i['name'])
                            else:
                                sdata.append( (i['name']+'.'+j['name']).replace(".sls", ""))
            try:
                var = []
                for i in db.session.query(Hosts).all():
                    var.append({"hostname": i.hostname})
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": var, "sdata":sdata})
            except:
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})
        if action == "cmd_execute":
            salt_cmd_mode_info = request.form['salt_cmd_mode_info']
            salt_cmd_mode = request.form['salt_cmd_mode']
            salt_cmd_hosts = request.form['hosts']
            salt = saltAPI(host=app.config['SALT_API_ADDR'], user=app.config['SALT_API_USER'],password=app.config['SALT_API_USER'], prot=app.config['SALT_API_PROT'])
            for cmd in app.config['SALT_CMD_EXCLUDE'].split(','):
                if cmd in salt_cmd_mode_info:
                    return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": "检查命令规范!"})
            data = ''
            for host in salt_cmd_hosts.split(','):
                data += u'<p style="font-weight:bold;color:red;"> 主机:%s 执行结果: </p>%s ' % (host,salt.saltCmd({"fun": salt_cmd_mode, "client": "local", "tgt": host , "arg":salt_cmd_mode_info})[0][host])
            return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": data})

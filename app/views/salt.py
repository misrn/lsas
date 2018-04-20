# -*- coding: utf-8 -*-
from app.views.common import *

# 定义蓝图
salt = Blueprint('salt', __name__)



@salt.route('/svnmg', methods=["GET", "POST"])
@login_required  # 登录保护
def svnmg():
    if request.method == 'POST':
        action = request.form['action']
        if action == "status":
           try:
               data = os.popen(app.config['SVN_CMD']+" status /data/salt | grep -v 'salt/deploy'").readlines()
               return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": data})
           except:
               return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})
        elif action == "commit":
            paths = request.form['paths']
            ci_text = request.form['ci_text']
            ci_passwd = request.form['ci_passwd']
            try:
                for path in paths.split(','):
                    if path.replace("\n", "").split('       ')[0] == "?":
                        os.popen(app.config['SVN_CMD']+" add "+path.replace("\n", "").split('       ')[1])
                    elif path.replace("\n", "").split('       ')[0] == "!":
                        os.popen(app.config['SVN_CMD']+" delete "+path.replace("\n", "").split('       ')[1])
                data = os.popen(app.config['SVN_CMD']+" ci -m '"+ci_text+"' --username "+ g.user.username +" --password "+ci_passwd+" --no-auth-cache --non-interactive  /data/salt 2>&1").readlines()
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": data })
            except:
                 return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})

@salt.route('/file', methods=["GET", "POST"])
@login_required  # 登录保护
def file():
    cmd = app.config['SVN_CMD'] + '  up  --username ' + app.config['SVN_USER'] + ' --password ' + app.config['SVN_PASSWD'] + '  --no-auth-cache --non-interactive /data/salt'
    data=os.popen(cmd).readlines()
    return render_template("salt/file.html")


@salt.route('/filemg', methods=["GET", "POST"])
@login_required  # 登录保护
def filemg():
    if request.method == 'POST':
        F = File()
        action = request.form['action']
        path = request.form['path']
        path_spl = path.split('/')
        if len(path_spl) <= 2 or path_spl[1] != 'data' or path_spl[2] != 'salt':
            data = {
                "code": -1,
                "msg": u"超出访问权限!",
                "data": ""
            }
            return json.dumps(data)

        if action == "listdir":
            return F.listdir(path)
        
        elif action == "rename":
            newname = request.form["newname"].replace(" ", "")  # 新名称
            try:
                Out_logs("salt_file",u"重命名:"+str(path+';为：'+newname))
            except:
                pass
            return F.rename(path, newname)

        elif action == "delete":
            try:
               Out_logs("salt_file",u"删除文件:"+str(path))
            except:
                pass
            return F.delete(path)

        elif action == "dadd":
            dname = request.form["dname"].replace(" ", "") # 目录名称
            try:
                Out_logs("salt_file",u"添加目录:"+str(path+'/'+dname))
            except:
                pass
            return F.dadd(path, dname)

        elif action == "fadd":
            dname = request.form["dname"].replace(" ", "") # 文件名称
            try:
                Out_logs("salt_file",u"添加文件:"+str(path+'/'+dname))
            except:
                pass
            return F.fadd(path, dname)

        elif action == "fopen":
            return F.fopen(path)

        elif action == "fsave":
            try:
                Out_logs("salt_file",u"修改文件:"+str(path))
            except:
                pass
            return F.fsave(path, request.form["content"])



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
            try:
                Out_logs(action,u"主机："+salt_cmd_hosts+u"执行命令:"+str(salt_cmd_mode)+'--'+salt_cmd_mode_info)
            except:
                pass
            salt = saltAPI(host=app.config['SALT_API_ADDR'], user=app.config['SALT_API_USER'],password=app.config['SALT_API_USER'], prot=app.config['SALT_API_PROT'])
            for cmd in app.config['SALT_CMD_EXCLUDE'].split(','):
                if cmd in salt_cmd_mode_info:
                    return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": u"检查命令规范!"})
            if salt_cmd_mode == "cmd.run":
                data = ''
                mode = 'txt'
            else:
                data = []
                mode = 'json'
            for host in salt_cmd_hosts.split(','):
                info = salt.saltCmd({"fun": salt_cmd_mode, "client": "local", "tgt": host , "arg":salt_cmd_mode_info})[0]
                if salt_cmd_mode == "cmd.run":
                    data += u'<p style="font-weight:bold;color:red;"> 主机:%s 执行结果: </p>%s ' % (host,info[host])
                else:
                    data.append(info)
            return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": data,"mode":mode})




















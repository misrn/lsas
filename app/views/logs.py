# -*- coding: utf-8 -*-
from app.views.common import *


# 定义蓝图
logs = Blueprint('logs', __name__)


@logs.route('/app', methods=["GET", "POST"])
@login_required  # 登录保护
def apps():
    project_name = request.args.get('project_name')
    host = request.args.get('host')

    cmd= "/data/bin/out_file.sh %s"%(project_name)
    salt = saltAPI(host=app.config['SALT_API_ADDR'], user=app.config['SALT_API_USER'],password=app.config['SALT_API_USER'], prot=app.config['SALT_API_PROT'])
    info = salt.saltCmd({"fun": "cmd.run", "client": "local", "tgt": host , "arg":cmd})[0][host]
    info = int(info)-50

    key = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    if "不存在!" in str(info):
        Redisd.Set(key, 0)
    else:
        Redisd.Set(key, info)
    Redisd.Expire(key,60*60*24)
    g.key = key
    g.project_name = project_name
    g.host = host
    return render_template("logs/index.html")


@logs.route('/appms', methods=["GET", "POST"])
@login_required  # 登录保护
def appms():
    if request.method == 'POST':
        key = request.form['key']
        project_name = request.form['project_name']
        host = request.form['host']
        line = Redisd.Get(key)
        cmd= "/data/bin/out_file.sh %s %s"%(project_name,str(int(line)+1))
        status, input = commands.getstatusoutput("/usr/bin/salt '%s' cmd.run '%s'" % (host, cmd))
        Redisd.Set(key, int(line)+input.count("\n"))
        Redisd.Expire(key,60*60*24)
        input=input.replace(host+":", "")
        input=input.replace("<", "&lt;")
        input=input.replace(">", "&gt;")
        return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": input})

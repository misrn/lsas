# -*- coding: utf-8 -*-
from app.views.common import *
import commands
import random
import string
import redis

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

    key = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    r = redis.Redis(host=app.config['REDIS_ADDR'], port=app.config['REDIS_PROT'],db=app.config['REDIS_DB'],password=app.config['REDIS_PASSWD'])
    if "不存在!" in info:
        r.set(key, 0)
    else:
        r.set(key, info)
    r.expire(key,60*60*24)
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
        r = redis.Redis(host=app.config['REDIS_ADDR'], port=app.config['REDIS_PROT'],db=app.config['REDIS_DB'],password=app.config['REDIS_PASSWD'])
        line = r.get(key)
        cmd= "/data/bin/out_file.sh %s %s"%(project_name,str(int(line)+1))
        status, input = commands.getstatusoutput("/usr/bin/salt '%s' cmd.run '%s'" % (host, cmd))
        r.set(key, int(line)+input.count("\n"))
        input=input.replace(host+":", "")
        input=input.replace("<", "&lt;")
        input=input.replace(">", "&gt;")
        return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": input})
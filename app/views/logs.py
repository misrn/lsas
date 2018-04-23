# -*- coding: utf-8 -*-
from app.views.common import *
import commands
from sqlalchemy import desc

# 定义蓝图
logs = Blueprint('logs', __name__)


@logs.route('/app', methods=["GET", "POST"])
@login_required  # 登录保护
def project():
    project_name = request.args.get('project_name')
    host = request.args.get('host')

    cmd= "wc -l  %s | awk '{print $1}'"%("/data/logs/a.log")

    status, input = commands.getstatusoutput(cmd)

    print input


    return render_template("logs/index.html")
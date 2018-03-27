# -*- coding: utf-8 -*-
from app.views.common import *
import commands

# 定义蓝图
deploy = Blueprint('deploy', __name__)


@deploy.route('/project', methods=["GET", "POST"])
@login_required  # 登录保护
def index():
    g.HostInfo = db.session.query(Hosts).all()
    return render_template("deploy/project.html")


@deploy.route('/projectmg', methods=["GET", "POST"])
@login_required  # 登录保护
def projectmg():
    if request.method == 'POST':
        action = request.form['action']
        if action == "list":
            try:
                ProjectInfo = db.session.query(Project).all()  # 请求所有项目
                var = []
                for i in ProjectInfo:
                    var.append({"project_name": i.project_name, "add_time": i.add_time, "up_time": i.up_time,
                                "pro_version": str(i.pro_version), "pre_version": str(i.pre_version),
                                "type": str(i.type)})
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": var}, cls=MyEncoder)
            except:
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})

        elif action == "listhosts":  # 请求所有主机
            try:
                var = []
                for i in db.session.query(Hosts).all():
                    var.append({"hostname": i.hostname})
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": var})
            except:
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})
        elif action == "addproject":
            project_type = request.form['project_type']
            project_name = request.form['project_name']
            Hosts_pro = request.form['Hosts_pro']
            Hosts_pre=request.form['Hosts_pre']

            commands.getstatusoutput(app.config['Svn_cmd']+'co --username' + app.config['Svn_User'] +'--password' + app.config['Svn_Passwd'] +'--no-auth-cache '+ app.config['Svn_addr']+project_name+'/'+app.config
                                     ['Svn_branch'] + app.config['Svn_Loca_Path'+project_name])


            print project_type,project_name,Hosts_pro,Hosts_pre

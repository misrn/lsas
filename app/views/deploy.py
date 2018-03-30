# -*- coding: utf-8 -*-
from app.views.common import *
import commands

# 定义蓝图
deploy = Blueprint('deploy', __name__)


@deploy.route('/project', methods=["GET", "POST"])
@login_required  # 登录保护
def project():
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
        elif action == "delete":
            project_name = request.form['project_name']
            dstatus, inputd=commands.getstatusoutput('rm -rf %s%s' % (app.config['SVN_LOCA_PATH'], project_name)) #删除代码目录
            fstatus, inputf=commands.getstatusoutput('rm -rf %s%s' % (app.config['SVN_LOCA_PATH'].replace("files/", ""),project_name.replace(".","-") + '.sls')) #删除执行文件
            if dstatus == 0 and fstatus ==0:
                try:
                    ProjectInfo = db.session.query(Project).filter_by(project_name=project_name).first()
                    db.session.delete(ProjectInfo)
                    db.session.commit()
                    return json.dumps({"code": 1, "msg": u"删除成功!", "data": ""})
                except:
                    return json.dumps({"code": -1, "msg": u"删除失败!", "data": ""})
            else:
                return json.dumps({"code": -1, "msg": u"删除失败!", "data": ""})


        elif action == "addproject":
            project_type = request.form['project_type']  # 项目类型
            project_name = request.form['project_name']  # 项目名称
            Hosts_pro = request.form['Hosts_pro']  # 生产主机列表
            Hosts_pre = request.form['Hosts_pre']  # 预发布主机列表
            # svn 代码拉取命令
            cmd = app.config['SVN_CMD'] + '  co --username ' + app.config['SVN_USER'] + ' --password ' + app.config['SVN_PASSWD'] + '  --no-auth-cache --non-interactive ' + app.config['SVN_ADDR'] + project_name + '/' + app.config['SVN_BRANCH'] + '  ' + app.config['SVN_LOCA_PATH'] + project_name

            # 根据项目类型进行判断
            if project_type == 'php':
                ugmode = 'apache'
            else:
                ugmode = project_name
            if project_type == 'tomcat':
                targe_path = app.config['SVN_TARGET_PATH'] + project_name + '/webapps/ROOT'
            else:
                targe_path = app.config['SVN_TARGET_PATH'] + project_name

            # 定义 sls 文件内容
            content = u"""
%s:
  file.recurse:
    - source: salt://%s%s
    - user: %s
    - group: %s
    - dir_mode: 644
    - file_mode: 644
    - makedirs: True
    - include_empty: True
""" % (targe_path, app.config['SVN_LOCA_PATH'].replace("/data/salt/salt/", ""), project_name, ugmode, ugmode)

            if not os.path.exists(app.config['SVN_LOCA_PATH']):  # 判断本地代码目录是否存在，不存在创建
                os.mkdir(app.config['SVN_LOCA_PATH'])

            if os.path.exists(app.config['SVN_LOCA_PATH'] + project_name):  # 判断项目代码目录存在的情况
                repo = os.popen("%s info %s%s|grep 'Repository Root'" % (app.config['SVN_CMD'], app.config['SVN_LOCA_PATH'], project_name)).readlines()[0].replace("Repository Root: ", "").replace("\n", "")
                branch = os.popen("%s info %s%s|grep 'Relative URL:'" % (app.config['SVN_CMD'], app.config['SVN_LOCA_PATH'], project_name)).readlines()[0].replace("Relative URL: ^/", "").replace("\n", "")
                if repo + '/' + branch != app.config['SVN_ADDR'] + project_name + '/' + app.config['SVN_BRANCH']:  # 判断svn是否是当前svn地址； 不是则删除目录
                    commands.getstatusoutput('rm -rf %s%s' % (app.config['SVN_LOCA_PATH'], project_name))
                else:  # 如果是返回已经存在该项目
                    return (json.dumps({"code": -1, "msg": u"该项目已经存在!", "data": ""}))

            status, input = commands.getstatusoutput(cmd)  # 拉取代码到本地
            if status == 0:
                F = File()
                fadd = F.fadd(app.config['SVN_LOCA_PATH'].replace("files/", ""),project_name.replace(".", "-") + '.sls') # 创建文件
                fsave = F.fsave(app.config['SVN_LOCA_PATH'].replace("files/", "") + project_name.replace(".","-") + '.sls', content) # 写入文件
                if json.loads(fadd)['code'] == 1 and json.loads(fsave)['code'] == 1:
                    try:  # 添加到数据库
                        data = mysqld.Project(
                            project_name=project_name,
                            type=project_type,
                            svn_addr=app.config['SVN_ADDR'] + project_name + '/' + app.config['SVN_BRANCH'],
                            app_path=targe_path,
                            loca_path=app.config['SVN_LOCA_PATH'] + project_name,
                            pre_hosts=Hosts_pre,
                            pro_hosts=Hosts_pro
                        )
                        db.session.add(data)
                        db.session.commit()
                        return (json.dumps({"code": 1, "msg": u"添加项目成功!", "data": ""}))
                    except:
                        commands.getstatusoutput('rm -rf %s%s' % (app.config['SVN_LOCA_PATH'], project_name)) #删除代码目录
                        commands.getstatusoutput('rm -rf %s%s' % (app.config['SVN_LOCA_PATH'].replace("files/", ""),project_name.replace(".","-") + '.sls')) #删除执行文件
                        return (json.dumps({"code": -1, "msg": u"添加项目失败!", "data": u"数据库写入失败!"}))
                else:
                    commands.getstatusoutput('rm -rf %s%s' % (app.config['SVN_LOCA_PATH'], project_name))
                    return (json.dumps({"code": -1, "msg": u"添加项目失败!", "data": u"创建执行文件失败!"}))
            else:
                return (json.dumps({"code": -1, "msg": u"添加项目失败!", "data": u"代码拉取失败"}))

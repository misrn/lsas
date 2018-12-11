# -*- coding: utf-8 -*-
from app.views.common import *


# 定义蓝图
deploy = Blueprint('deploy', __name__)


@deploy.route('/project', methods=["GET", "POST"])
@login_required  # 登录保护
def project():
    return render_template("deploy/project.html")


@deploy.route('/push', methods=["GET", "POST"])
@login_required  # 登录保护
def push():
    return render_template("deploy/push.html")

@deploy.route('/pushmg', methods=["GET", "POST"])
@login_required  # 登录保护
@user_jurisdiction
def pushmg():
    if request.method == 'POST':
        action = request.form['action']
        if action == "list":
            try:
                ProjectInfo = db.session.query(Project).all()  # 请求所有项目
                var = []
                for i in ProjectInfo:
                    var.append(
                        {"project_name": i.project_name, "add_time": i.add_time, "up_time": i.up_time, "id": i.id,
                         "pro_version": str(i.pro_version), "pre_version": str(i.pre_version),
                         "type": str(i.type)})
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": var}, cls=MyEncoder)
            except:
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})
        elif action == "selecthost":
            project_id = request.form['project_id']
            ProjectInfo = Project.query.get(project_id)
            var = []
            for host in ProjectInfo.pro_hosts.split(','):
                var.append({"hostname":host})
            return (json.dumps({"code": 1,"data": var}))
        elif action == "sinfo":
            project_id = request.form['project_id']
            ProjectInfo = Project.query.get(project_id)
            ProjectDeployLogs = Deploy_logs.query.filter_by(deploy_project_id=project_id).order_by(desc("id")).limit(
                app.config['SHOW_DEPLOY_LOGS_NUM'])
            qdata = []
            for i in ProjectDeployLogs:
                qdata.append(
                    {
                        "id": i.id,
                        "deploy_user": i.deploy_user,
                        "deploy_version": i.deploy_version,
                        "deploy_time": i.deploy_time,
                        "deploy_txt": i.deploy_txt
                    }
                )
            Slogs = []
            for i in Svn_logs(ProjectInfo.svn_addr):
                try:
                    message = i.message
                except:
                    message = ""

                files = []
                for j in i.changed_paths:
                    files.append({
                        "action": j.action,
                        "path": j.path
                    })

                Slogs.append({
                    "revision": int(filter(str.isdigit, str(i.revision))),
                    "author": i.author,
                    "time": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(i.date)),
                    "message": message,
                    "changed_paths": files
                })
            return (json.dumps({"code": 1,
                                "project_id": project_id,
                                "project_type":ProjectInfo.type,
                                "pro_version": ProjectInfo.pro_version,
                                "msg": u"请求数据成功!",
                                "qdata": qdata,
                                "sdata": Slogs,
                                "qnum": app.config['SHOW_DEPLOY_LOGS_NUM'],
                                "snum": app.config['SHOW_SVN_LOGS_NUM'],
                                "project_name": ProjectInfo.project_name}, cls=MyEncoder)
                    )
        elif action == "loginfo":
            try:
                LogInfo = Deploy_logs.query.get(request.form['log_id'])
                return (json.dumps({"code": 1, "msg": u"请求数据成功!", "data": LogInfo.deploy_txt}))
            except:
                return (json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""}))
        elif action == "pcode":
            txt = ''
            project_id = request.form['project_id']
            svn_revision = request.form['svn_revision']
            restarthost = request.form['restarthost']
            try:
                ProjectInfo = Project.query.get(project_id)
            except:
                return (json.dumps({"code": -1, "msg": u"项目发布失败!", "data": u"查询项目信息失败"}))
            cmd = app.config['SVN_CMD'] + '  up  -r  ' + svn_revision + ' --username ' + app.config['SVN_USER'] + ' --password ' + app.config['SVN_PASSWD'] + '  --no-auth-cache --non-interactive ' + ProjectInfo.loca_path
            status, input = commands.getstatusoutput(cmd)  # 执行代码更新
            txt += u'<p style="font-weight:bold;color:red;"> svn 更新日志: </p>  <p> %s </p>' % (input)
            if status == 0:
                for host in ProjectInfo.pro_hosts.split(','):  # 循环主机
                    status, input = commands.getstatusoutput("/usr/bin/salt '%s' state.sls deploy.%s" % (host, ProjectInfo.project_name.replace(".", "-")))  # 执行代码同步
                    if status ==0:
                        txt += u'<p style="font-weight:bold;color:green;">主机 %s 代码同步完成 </p>' % (host)
                    else:
                        txt += u'<p style="font-weight:bold;color:red;">主机 %s 代码同步失败 </p>' % (host)
                        print input
                    if status == 0 and request.form['restart'] == "y":
                        if host in restarthost:
                            status, input = commands.getstatusoutput("/usr/bin/salt '%s' cmd.run '/usr/sbin/service %s restart'" % (host, ProjectInfo.project_name))  # 重启程序
                            if status ==0:
                                txt += u'<p style="font-weight:bold;color:green;">主机 %s 重启程序完成 </p>' % (host)
                            else:
                                txt += u'<p style="font-weight:bold;color:red;">主机 %s 重启程序失败 </p>' % (host)
                                txt += u'<p style="font-weight:bold;color:red;"> 错误日志: </p>  <p> %s </p>' % (input)
                data = mysqld.Deploy_logs(
                    deploy_version=svn_revision,
                    deploy_user=g.user.full_name,
                    deploy_project_id=project_id,
                    deploy_txt=txt
                )
                db.session.add(data)
                ProjectInfo.pro_version = svn_revision
                db.session.commit()
                InputLog("pushmg.pcode",u"发布代码成功，项目名称：%s"%(ProjectInfo.project_name))
                return (json.dumps({"code": 1, "msg": u"项目发布成功!", "data": txt}))

            else:
                data = mysqld.Deploy_logs(
                    deploy_version=svn_revision,
                    deploy_user=g.user.full_name,
                    deploy_project_id=project_id,
                    deploy_txt=txt
                )
                db.session.add(data)
                db.session.commit()
                return (json.dumps({"code": -1, "msg": u"项目发布失败!", "data": u"代码更新失败"}))



@deploy.route('/projectmg', methods=["GET", "POST"])
@login_required  # 登录保护
@user_jurisdiction
def projectmg():
    if request.method == 'POST':
        action = request.form['action']
        if action == "list":
            try:
                ProjectInfo = db.session.query(Project).all()  # 请求所有项目
                var = []
                for i in ProjectInfo:
                    var.append(
                        {"project_name": i.project_name, "add_time": i.add_time, "up_time": i.up_time, "id": i.id,
                         "pro_version": str(i.pro_version), "pre_version": str(i.pre_version),
                         "type": str(i.type)})
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": var}, cls=MyEncoder)
            except:
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})
        elif action == "gethosts":
            try:
                id = request.form['project_id']
                print id
                ProjectInfo = Project.query.get(id)
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": ProjectInfo.pro_hosts,"project_name":ProjectInfo.project_name},cls=MyEncoder)
            except:
                return json.dumps({"code": -1, "msg": u"请求数据失败!", "data": ""})
        elif action == "pinfo":

            ProjectInfo = Project.query.get(request.form['project_id'])
            data = {
                "项目ID": ProjectInfo.id,
                "项目名称": ProjectInfo.project_name,
                "添加时间": ProjectInfo.add_time,
                "更新时间": ProjectInfo.up_time,
                "预生产当前版本": ProjectInfo.pre_version,
                "生产当前版本": ProjectInfo.pro_version,
                "项目类型": ProjectInfo.type,
                "Svn地址": ProjectInfo.svn_addr,
                "远端路径": ProjectInfo.app_path,
                "本地路径": ProjectInfo.loca_path,
                "预生产主机列表": ProjectInfo.pre_hosts,
                "生产主机列表": ProjectInfo.pro_hosts
            }

            sdata = {
                "id":ProjectInfo.id,
                "project_name":ProjectInfo.project_name,
                "pre_hosts":ProjectInfo.pre_hosts,
                "pro_hosts":ProjectInfo.pro_hosts,
                "type":ProjectInfo.type
            }

            g.edit_id = ProjectInfo.id
            return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": data,"sdata":sdata},cls=MyEncoder)
        elif action == "editproject": #编辑项目
            try:
                project_name = request.form['project_name']
                Hosts_pro = request.form['Hosts_pro']  # 生产主机列表
                Hosts_pre = request.form['Hosts_pre']  # 预发布主机列表
                Projecti = Project.query.filter_by(project_name=project_name).first()
                Projecti.pre_hosts=Hosts_pre
                Projecti.pro_hosts=Hosts_pro
                Projecti.up_time=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                db.session.commit()
                InputLog("projectmg.edit",u"编辑项目成功，项目名称：%s"%(project_name))
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": ""},cls=MyEncoder)
            except:
                return json.dumps({"code": 1, "msg": u"编辑失败!", "data": ""},cls=MyEncoder)
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
            dstatus, inputd = commands.getstatusoutput(
                'rm -rf %s%s' % (app.config['SVN_LOCA_PATH'], project_name))  # 删除代码目录
            fstatus, inputf = commands.getstatusoutput('rm -rf %s%s' % (
                app.config['SVN_LOCA_PATH'].replace("files/", ""), project_name.replace(".", "-") + '.sls'))  # 删除执行文件
            if dstatus == 0 and fstatus == 0:
                try:
                    ProjectInfo = db.session.query(Project).filter_by(project_name=project_name).first()
                    db.session.delete(ProjectInfo)
                    db.session.commit()
                    InputLog("projectmg.del",u"删除项目成功，项目名称：%s"%(project_name))
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
            Projecti = Project.query.filter_by(project_name=project_name).first()
            if Projecti is not None:
                return (json.dumps({"code": -1, "msg": u"该项目已经存在!", "data": ""}))
            # svn 代码拉取命令
            cmd = app.config['SVN_CMD'] + '  co --username ' + app.config['SVN_USER'] + ' --password ' + app.config[
                'SVN_PASSWD'] + '  --no-auth-cache --non-interactive ' + app.config['SVN_ADDR'] + project_name + '/' + \
                  app.config['SVN_BRANCH'] + '  ' + app.config['SVN_LOCA_PATH'] + project_name

            # 根据项目类型进行判断
            if project_type == 'php':
                ugmode = app.config['PHP_MODE']
            else:
                ugmode = project_name
            if project_type == 'tomcat':
                targe_path = app.config['SVN_TARGET_PATH'] + project_name + '/webapps/ROOT'
            elif project_type == 'php':
                targe_path = app.config['SVN_TARGET_PATH'] + project_name + app.config['PHP_ROOT']
            else:
                targe_path = app.config['SVN_TARGET_PATH'] + project_name

            # 定义 sls 文件内容
            content = u"""
%s:
  file.recurse:
    - source: salt://%s%s
    - user: %s
    - group: %s
    - dir_mode: 755
    - file_mode: 644
    - makedirs: True
    - include_empty: True
    - clean: True
""" % (targe_path, app.config['SVN_LOCA_PATH'].replace("/data/salt/salt/", ""), project_name, ugmode, ugmode)

            if not os.path.exists(app.config['SVN_LOCA_PATH']):  # 判断本地代码目录是否存在，不存在创建
                os.mkdir(app.config['SVN_LOCA_PATH'])

            if os.path.exists(app.config['SVN_LOCA_PATH'] + project_name):  # 判断项目代码目录存在的情况
                repo = os.popen("%s info %s%s|grep 'Repository Root'" % (
                    app.config['SVN_CMD'], app.config['SVN_LOCA_PATH'], project_name)).readlines()[0].replace(
                    "Repository Root: ", "").replace("\n", "")
                branch = os.popen("%s info %s%s|grep 'Relative URL:'" % (
                    app.config['SVN_CMD'], app.config['SVN_LOCA_PATH'], project_name)).readlines()[0].replace(
                    "Relative URL: ^/", "").replace("\n", "")
                if repo + '/' + branch != app.config['SVN_ADDR'] + project_name + '/' + app.config[
                    'SVN_BRANCH']:  # 判断svn是否是当前svn地址； 不是则删除目录
                    commands.getstatusoutput('rm -rf %s%s' % (app.config['SVN_LOCA_PATH'], project_name))
                else:  # 如果是返回已经存在该项目
                    return (json.dumps({"code": -1, "msg": u"该项目已经存在!", "data": ""}))

            status, input = commands.getstatusoutput(cmd)  # 拉取代码到本地
            if status == 0:
                F = File()
                fadd = F.fadd(app.config['SVN_LOCA_PATH'].replace("files/", ""),
                              project_name.replace(".", "-") + '.sls')  # 创建文件
                fsave = F.fsave(
                    app.config['SVN_LOCA_PATH'].replace("files/", "") + project_name.replace(".", "-") + '.sls',
                    content)  # 写入文件
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
                        InputLog("projectmg.add",u"添加项目成功，项目名称：%s"%(project_name))
                        return (json.dumps({"code": 1, "msg": u"添加项目成功!", "data": ""}))
                    except:
                        commands.getstatusoutput('rm -rf %s%s' % (app.config['SVN_LOCA_PATH'], project_name))  # 删除代码目录
                        commands.getstatusoutput('rm -rf %s%s' % (app.config['SVN_LOCA_PATH'].replace("files/", ""),
                                                                  project_name.replace(".", "-") + '.sls'))  # 删除执行文件
                        return (json.dumps({"code": -1, "msg": u"添加项目失败!", "data": u"数据库写入失败!"}))
                else:
                    commands.getstatusoutput('rm -rf %s%s' % (app.config['SVN_LOCA_PATH'], project_name))
                    return (json.dumps({"code": -1, "msg": u"添加项目失败!", "data": u"创建执行文件失败!"}))
            else:
                return (json.dumps({"code": -1, "msg": u"添加项目失败!", "data": u"代码拉取失败"}))

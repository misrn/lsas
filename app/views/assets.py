# -*- coding: utf-8 -*-
from app.views.common import *

# 定义蓝图
assets = Blueprint('assets', __name__)


# 固定资产主机列表模块
@assets.route('/hosts', methods=["GET", "POST"])
@login_required  # 登录保护
def hosts():
    g.HostInfo = db.session.query(Hosts).all()  # 查询所有用户信息
    return render_template("assets/hosts.html")


# 固定资产主机列表更新模块
@assets.route('/hosts_up', methods=["GET", "POST"])
@login_required  # 登录保护
def hosts_up():
    if request.method == 'POST':
        #初始化saltstack api
        salt = saltAPI(host=app.config['SALT_API_ADDR'], user=app.config['SALT_API_USER'],password=app.config['SALT_API_USER'], prot=app.config['SALT_API_PROT'])
        # {"fun": "%s", "client": "%s", "tgt": "%s" ,"arg": "%s"} 执行命令
        HostAllInfo = salt.saltCmd({"fun": "grains.items", "client": "local", "tgt": "*"})[0] #获取所有主机信息
        for host in HostAllInfo:
            #查询当前主机信息
            HostInfo= db.session.query(Hosts).filter_by(hostname=host).first()
            if HostInfo is None: #主机不存在添加
                HostData = mysqld.Hosts(
                    hostname=HostAllInfo[host]['id'],
                    os=HostAllInfo[host]['os'],
                    osrelease=HostAllInfo[host]['osrelease'],
                    kernelrelease=HostAllInfo[host]['kernelrelease'],
                    selinux=HostAllInfo[host]['selinux']['enforced'],
                    status="正常",
                    mem_total=HostAllInfo[host]['mem_total'],
                    num_cpus=HostAllInfo[host]['num_cpus'],
                )
                db.session.add(HostData)
                db.session.commit()
            else:
                HostInfo.os=HostAllInfo[host]['os']
                HostInfo.osrelease=HostAllInfo[host]['osrelease']
                HostInfo.kernelrelease=HostAllInfo[host]['kernelrelease']
                HostInfo.selinux=HostAllInfo[host]['selinux']['enforced']
                HostInfo.status="正常"
                HostInfo.mem_total=HostAllInfo[host]['mem_total']
                HostInfo.num_cpus=HostAllInfo[host]['num_cpus']
                HostInfo.up_time=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                db.session.commit()
        return rep_json("操作成功")
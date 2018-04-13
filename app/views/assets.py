# -*- coding: utf-8 -*-
from app.views.common import *

# 定义蓝图
assets = Blueprint('assets', __name__)


# 固定资产主机列表模块
@assets.route('/hosts', methods=["GET", "POST"])
@login_required  # 登录保护
def hosts():
    g.HostInfo = db.session.query(Hosts).all()  # 查询所有主机
    return render_template("assets/hosts.html")


# 固定资产主机列表详细主机信息
@assets.route('/host_info', methods=["GET", "POST"])
@login_required  # 登录保护
def host_info():
    if request.method == 'POST':
        HostName = request.form['hostname']
        salt = saltAPI(host=app.config['SALT_API_ADDR'], user=app.config['SALT_API_USER'],
                       password=app.config['SALT_API_USER'], prot=app.config['SALT_API_PROT'])
        HostAllInfo = salt.saltCmd({"fun": "grains.items", "client": "local", "tgt": HostName})[0]
        return json.dumps(Json_Unicode_To_Uft8(HostAllInfo))


# 固定资产主机列表更新模块
@assets.route('/hosts_up', methods=["GET", "POST"])
@login_required  # 登录保护
def hosts_up():
    if request.method == 'POST':
        try:
            Out_logs("hosts_up",u"更新主机信息")
        except:
            pass
        try:

            # 初始化saltstack api
            salt = saltAPI(host=app.config['SALT_API_ADDR'], user=app.config['SALT_API_USER'],
                           password=app.config['SALT_API_USER'], prot=app.config['SALT_API_PROT'])

            SaltHostAll = salt.saltCmd({"fun": "key.list_all", "client": "wheel"})[0]

            # 删除不存在的主机
            for host in db.session.query(Hosts).all():
                if not host.hostname in SaltHostAll["data"]["return"]["minions"]:
                    db.session.delete(Hosts.query.get(host.id))
                    db.session.commit()

            HostAllInfo = salt.saltCmd({"fun": "grains.items", "client": "local", "tgt": "*"})[0]  # 获取所有主机信息
            for host in HostAllInfo:
                try:
                    ipaddr = HostAllInfo[host]['ip4_interfaces']['eth0'][0]
                except:
                    ipaddr = ""
                # 查询当前主机信息
                HostInfo = db.session.query(Hosts).filter_by(hostname=host).first()
                if HostInfo is not None and HostAllInfo[host] == False:  # db主机存在 且 salt返回 false；及主机离线
                    HostInfo.status = "0"
                elif HostInfo is None and HostAllInfo[host] != False:  # DB主机不存在且salt 返回不为 false；及新增主机
                    HostData = mysqld.Hosts(
                        hostname=HostAllInfo[host]['id'],
                        os=HostAllInfo[host]['os'],
                        osrelease=HostAllInfo[host]['osrelease'],
                        kernelrelease=HostAllInfo[host]['kernelrelease'],
                        selinux=HostAllInfo[host]['selinux']['enforced'],
                        status="1",
                        mem_total=HostAllInfo[host]['mem_total'],
                        num_cpus=HostAllInfo[host]['num_cpus'],
                        eth0_ipaddr=ipaddr
                    )
                    db.session.add(HostData)
                elif HostInfo is not None and HostAllInfo[host] != False:  # DB主机存在且 salt 返回不为false ； 及更新主机信息
                    HostInfo.os = HostAllInfo[host]['os']
                    HostInfo.osrelease = HostAllInfo[host]['osrelease']
                    HostInfo.kernelrelease = HostAllInfo[host]['kernelrelease']
                    HostInfo.selinux = HostAllInfo[host]['selinux']['enforced']
                    HostInfo.status = "1"
                    HostInfo.mem_total = HostAllInfo[host]['mem_total']
                    HostInfo.num_cpus = HostAllInfo[host]['num_cpus']
                    HostInfo.up_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                    # eth0_ipaddr=HostAllInfo[host]['ip4_interfaces']['eth0'][0]
                    HostInfo.eth0_ipaddr = ipaddr
                db.session.commit()
            return rep_json(1, "更新主机信息成功!", "")
        except:
            return rep_json(-1, "更新主机信息失败!", "")

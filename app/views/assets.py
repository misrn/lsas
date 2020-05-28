# -*- coding: utf-8 -*-
from app.views.common import *

# 定义蓝图
assets = Blueprint('assets', __name__)


# 固定资产主机列表HTML模块
@assets.route('/hosts', methods=["GET", "POST"])
@login_required  # 登录保护
def hosts():
    return render_template("assets/hosts.html")


# 固定资产主机模块
@assets.route('/hostsmg', methods=["GET", "POST"])
@login_required  # 登录保护
@user_jurisdiction
def hostsmg():
    if request.method == 'POST':
        action = request.form['action']
        if action == "list":
            try:
                hostlist = []
                for host in db.session.query(Hosts).all():
                    hostlist.append({"id": host.id, "hostname": host.hostname, "os": host.os, "osrelease": host.osrelease,
                                     "kernelrelease": host.kernelrelease, "selinux": host.selinux
                                        , "status": host.status, "mem_total": host.mem_total, "num_cpus": host.num_cpus,
                                     "add_time": host.add_time, "up_time": host.up_time, "eth0_ipaddr": host.eth0_ipaddr
                                     })
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": hostlist}, cls=MyEncoder)
            except Exception as error:
                print(str(error))
                return json.dumps({"code": 1, "msg": u"请求数据失败!", "data": ""}, cls=MyEncoder)

        if action == "hostsup":
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
                     except Exception as error:
                         print(str(error))
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
                         HostInfo.eth0_ipaddr = ipaddr
                     db.session.commit()
                 logs("hostsmg.hostsup",u"更新主机列表成功")
                 return json.dumps({"code": 1, "msg": u"更新主机列表成功!", "data": ""}, cls=MyEncoder)
            except Exception as error:
                print(str(error))
                return json.dumps({"code": -1, "msg": u"更新主机列表失败!", "data": ""}, cls=MyEncoder)
        if action == "hostinfo":
            try:
                HostName = request.form['hostname']
                salt = saltAPI(host=app.config['SALT_API_ADDR'], user=app.config['SALT_API_USER'],
                           password=app.config['SALT_API_USER'], prot=app.config['SALT_API_PROT'])
                HostAllInfo = salt.saltCmd({"fun": "grains.items", "client": "local", "tgt": HostName})[0]
                return json.dumps({"code": 1, "msg": u"请求数据成功!", "data": Json_Unicode_To_Uft8(HostAllInfo)}, cls=MyEncoder)
            except Exception as error:
                print(str(error))
                return json.dumps({"code": -1, "msg": u"请求数据成功!", "data": ""}, cls=MyEncoder)
//更新固定资产主机列表
function assets_update_hosts() {
    layer.msg("更新中，请稍后....", {time: 0});
    $.ajax({
        type: 'post',
        url: '/assets/hostsmg',
        data: {
            "action": 'hostsup'
        },
        dataType: 'json',
        success: function (data) {
            if (data.code == 1) {
                layer.msg(data.msg);
                assets_hosts_list()
            } else {
                layer.msg(data.msg)
            }
        }
    });
}


//显示主机详细信息
function hostsinfo(hostname) {
    layer.msg("数据加载中，请稍后....", {time: 0});
    $.ajax({
        type: 'post',
        url: '/assets/hostsmg',
        data: {
            "action": 'hostinfo',
            "hostname": hostname
        },
        dataType: 'json',
        success: function (res) {
            layer.msg("数据加载完成!");
            if (res.code == 1) {
                layer.open({
                    type: 1,
                    //skin: 'layui-layer-rim', //加上边框
                    area: ['820px', '840px'], //宽高
                    content: '<pre id="result">' + syntaxHighlight(res.data) + '</pre>'
                });
            } else {
                layer.mgs(res.mgs)
            }
        }
    });
}


function assets_hosts_list() {
    $.ajax({
        type: 'post',
        url: '/assets/hostsmg',
        data: {
            "action": 'list'
        },
        dataType: 'json',
        success: function (js) {
            var obj = js;
            if (obj.code != 1) {
                layer.msg(obj.msg)
            } else {
                var trStr = '';
                for (i = 0; i < obj.data.length; i++) {
                    trStr += '<tr> ';
                    trStr += '<td><p style="font-weight:bold">' + obj.data[i].hostname + '</p></td> ';
                    trStr += '<td> ' + obj.data[i].os + obj.data[i].osrelease + '</td>';
                    trStr += '<td> ' + obj.data[i].kernelrelease + '</td>';
                    trStr += '<td> ' + obj.data[i].eth0_ipaddr + '</td>';
                    trStr += '<td> ' + obj.data[i].selinux + '</td>';
                    trStr += '<td> ' + obj.data[i].num_cpus + '</td>';
                    trStr += '<td> ' + obj.data[i].mem_total + '</td>';
                    if (obj.data[i].status == "1") {
                        trStr += '<td><a><span class="label label-success">正常</span></a></td>';
                    } else if (obj.data[i].status == "0") {
                        trStr += '<td><a><span class="label label-danger">离线</span></a>'
                    } else {
                        trStr += '<td><a><span class="label label-warning">未知</span></a>'
                    }
                    trStr += '<td> ' + obj.data[i].add_time + '</td>';
                    trStr += '<td> ' + obj.data[i].up_time + '</td>';
                    trStr += '<td onclick=hostsinfo("' + obj.data[i].hostname + '")><a href="#"> <span class="label label-info" ><i class="fa fa-fw fa-bars"></i>详细</span></a></td>';
                    trStr += '</tr> ';
                }
                $("#assets-hosts-list").html(trStr);
            }
        }
    });

}
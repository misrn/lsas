//更新固定资产主机列表
function assets_update_hosts() {
    layer.msg("更新中，请稍后....", {time: 0});
    $.ajax({
        type: 'post',
        url: '/assets/hosts_up',
        dataType: 'json',
        success: function (data) {
            if (data.code == 1) {
                location.reload();
            } else {
                layer.msg(obj2.msg)
            }
        }
    });
}


//显示主机详细信息
function hostsinfo(hostname) {
    layer.msg("数据加载中，请稍后....", {time: 0});
    $.ajax({
        type: 'post',
        url: '/assets/host_info',
        data: {
            hostname: hostname
        },
        dataType: 'json',
        success: function (res) {
            layer.msg("数据加载完成!");
            layer.open({
                type: 1,
                //skin: 'layui-layer-rim', //加上边框
                area: ['820px', '840px'], //宽高
                content: '<pre id="result">' + syntaxHighlight(res) + '</pre>'
            });
        }
    });
}
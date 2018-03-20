//禁用用户
function sys_user_disable(user_id) {
    layer.msg('你确定停用该用户?', {
        time: 0 //不自动关闭
        , btn: ['确定', '取消']
        , yes: function (index) {
            layer.close(index);
            $.ajax({
                type: 'post',
                url: '/sys/users_mg',
                data: {
                    user_id: user_id,
                    operation: 'disable'
                },
                dataType: 'json',
                success: function (data) {
                    var obj2 = eval(data);
                    layer.msg(obj2.status)
                }
            });
        }
    });
}

//启用用户
function sys_user_enable(user_id) {
    layer.msg('你确定启用该用户?', {
        time: 0 //不自动关闭
        , btn: ['确定', '取消']
        , yes: function (index) {
            layer.close(index);
            $.ajax({
                type: 'post',
                url: '/sys/users_mg',
                data: {
                    user_id: user_id,
                    operation: 'enable'
                },
                dataType: 'json',
                success: function (data) {
                    var obj2 = eval(data);
                    layer.msg(obj2.status)
                }
            });
        }
    });
}

//删除用户
function sys_user_del(obj, user_id) {
    layer.msg('你确定删除该用户?', {
        time: 0 //不自动关闭
        , btn: ['确定', '取消']
        , yes: function (index) {
            layer.close(index);
            $.ajax({
                type: 'post',
                url: '/sys/users_mg',
                data: {
                    user_id: user_id,
                    operation: 'del'
                },
                dataType: 'json',
                success: function (data) {
                    var obj2 = eval(data);
                    if (obj2.status == "操作成功") {
                        var index = obj.parentNode.rowIndex;
                        var table = document.getElementById("example1");
                        table.deleteRow(index)
                    } else {
                        layer.msg(obj2.status)
                    }
                }
            });
        }
    });
}

//更新固定资产主机列表
function assets_update_hosts() {
    layer.msg("更新中，请稍后....", {time: 0});
    $.ajax({
        type: 'post',
        url: '/assets/hosts_up',
        dataType: 'json',
        success: function (data) {
            var obj2 = eval(data);
            if (obj2.status == "操作成功") {
                layer.msg("更新完成，请刷新页面");
            } else {
                layer.msg(obj2.status)
            }
        }
    });
}

//重载页面
function Overloaded_page() {
    var index = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    location.reload();

}

//json处理
function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

//显示主机详细信息
function hostsinfo(hostname) {
    $.ajax({
        type: 'post',
        url: '/assets/host_info',
        data: {
            hostname: hostname
        },
        dataType: 'json',
        success: function (res) {
            layer.open({
                type: 1,
                //skin: 'layui-layer-rim', //加上边框
                area: ['820px', '840px'], //宽高
                content: '<pre id="result">' + syntaxHighlight(res) + '</pre>'
            });
        }
    });
}

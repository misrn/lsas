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


function saltmodifyname(repath, dpath) {
    layer.prompt(function (newname, index) {

        $.ajax({
            type: 'post',
            url: '/salt/filemg',
            data: {
                "path": repath,
                "action": 'rename',
                "newname": newname
            },
            dataType: 'json',
            success: function (js) {
                //var obj = JSON.parse(js);
                var obj = js;
                if (obj.code == 1) {
                    saltlistdir(dpath)
                } else {
                    layer.msg(obj.msg)
                }
            }
        });
        layer.close(index);
    });
}

function saltdelete(depath, dpath) {
    layer.msg('你确定删除该文件?', {
        time: 0 //不自动关闭
        , btn: ['确定', '取消']
        , yes: function (index) {
            layer.close(index);
            $.ajax({
                type: 'post',
                url: '/salt/filemg',
                data: {
                    "path": depath,
                    "action": 'delete'
                },
                dataType: 'json',
                success: function (js) {
                    //var obj = JSON.parse(js);
                    var obj = js;
                    if (obj.code == 1) {
                        saltlistdir(dpath)
                    } else {
                        layer.msg(obj.msg)
                    }
                }
            });
        }
    });
}

//打开文件
function saltfopen(path, dpath) {

    $.ajax({
        type: 'post',
        url: '/salt/filemg',
        data: {
            "path": path,
            "action": 'fopen'
        },
        dataType: 'json',
        success: function (js) {
            //var obj = JSON.parse(js);
            var obj = js;
            if (obj.code == 1) {
                var SrtNavigation = ' <a class="btn btn-default btn-xs" onclick=saltlistdir("' + dpath + '")><i class="fa fa-fw fa-reply"></i> 返回目录列表 </a>\n' +
                    '                    <a class="btn btn-default btn-xs" onclick=saltfsave("' + path + '")><i class="fa fa-fw fa-save"></i> 保存 </a>';
                $('#list').hide();
                $('#edit').show();
                $('#filename').html("正在编辑文件:" + path);
                 var Str =  '<textarea spellcheck="false" id="fopentxt" style="width:100%; height:720px; font-family:SimSun">'+obj.data+'</textarea>';
 //               var Str = '<pre contenteditable="true" id="fopentxt" >' + obj.data + '</pre>';
                $("#editor").html(Str);
                $('#Navigation').html(SrtNavigation)
            }
        }
    });

}

//保存文件
function saltfsave(path) {
    $.ajax({
        type: 'post',
        url: '/salt/filemg',
        data: {
            "path": path,
            "action": 'fsave',
            "content": $('#fopentxt').val()
        },
        dataType: 'json',
        success: function (js) {
            //var obj = JSON.parse(js);
            var obj = js;
            layer.msg(obj.msg)

        }
    });

}


function saltlistdir(path) {
    $.ajax({
        type: 'post',
        url: '/salt/filemg',
        data: {
            "path": path,
            "action": 'listdir'
        },
        dataType: 'json',
        success: function (js) {
            //var obj = JSON.parse(js);
            var obj = js;
            if (obj.code != 1) {
                layer.msg(obj.msg)
            } else {
                var trStr = '';
                for (i = 0; i < obj.data.length; i++) {
                    var loca_path = path + '/' + obj.data[i].name;

                    trStr += '<tr> ';
                    if (obj.data[i].islnk) { //判断是否是软连接
                        trStr += '<td> <i class="fa fa-fw fa-chain"></i>' + obj.data[i].name + '</td> ';
                    } else if (obj.data[i].isdir) { //判断是否是目录

                        trStr += '<td onclick=saltlistdir("' + loca_path + '")> <i class="fa fa-fw fa-folder-open"></i><a href="#">' + obj.data[i].name + '</a></td> ';
                    } else {
                        trStr += '<td onclick=saltfopen("' + loca_path + '","' + path + '")> <i class="fa fa-fw fa-file"></i><a href="#">' + obj.data[i].name + '</a></td> ';
                    }
                    trStr += '<td> ' + obj.data[i].size + '</td>';
                    trStr += '<td> ' + obj.data[i].uname + '</td>';
                    trStr += '<td> ' + obj.data[i].gname + '</td>';
                    trStr += '<td> ' + obj.data[i].perms + '</td>';
                    trStr += '<td> ' + obj.data[i].atime + '</td>';
                    trStr += '<td> <a class="btn btn-default btn-xs" onclick=saltdelete("' + loca_path + '","' + path + '")><i class="fa fa-fw fa-bitbucket-square"></i>删除</a> ' +
                        '          <a class="btn btn-default btn-xs" onclick=saltmodifyname("' + loca_path + '","' + path + '")><i class="fa fa-fw fa-edit"></i>改名</a> ' +
                        '</td>';
                    trStr += '</tr> ';
                }
                if (path != "/data/salt") {
                    var path_split = path.split('/');
                    var locapath = '';
                    var dpath = '/data/salt/';
                    for (i = 3; i < path_split.length; i++) {
                        dpath += path_split[i];
                        locapath += '<a class="btn btn-primary btn-xs" onclick=saltlistdir("' + dpath + '")>' + path_split[i] + '</a> /';
                        dpath += '/';
                    }
                } else {
                    locapath = '';
                }
                var addbutth = '<a class="btn btn-default btn-xs" onclick=saltdadd("' + path + '")><i class="fa fa-fw  fa-folder-open"></i> 创建文件夹</a>\n' +
                    '                    <a class="btn btn-default btn-xs" onclick=saltfadd("' + path + '")><i class="fa fa-fw  fa-file"></i> 创建文件</a>';
                $('#list').show();
                $('#edit').hide();
                $("#locapath").html(locapath); //更改目录导航
                $("#filelist").html(trStr);
                $("#add-new-path").html(addbutth);
            }
        }
    });
}

function saltdadd(dpath) {
    layer.prompt({title:"输入文件夹名称"},function (dname, index) {
        $.ajax({
            type: 'post',
            url: '/salt/filemg',
            data: {
                "path": dpath,
                "action": 'dadd',
                "dname": dname
            },
            dataType: 'json',
            success: function (js) {
                //var obj = JSON.parse(js);
                var obj = js;
                if (obj.code == 1) {
                    saltlistdir(dpath)
                } else {
                    layer.msg(obj.msg)
                }
            }
        });
        layer.close(index);
    });
}

function saltfadd(dpath) {
    layer.prompt({title:"输入文件名称"},function (dname, index) {
        $.ajax({
            type: 'post',
            url: '/salt/filemg',
            data: {
                "path": dpath,
                "action": 'fadd',
                "dname": dname
            },
            dataType: 'json',
            success: function (js) {
                //var obj = JSON.parse(js);
                var obj = js;
                if (obj.code == 1) {
                    saltlistdir(dpath)
                } else {
                    layer.msg(obj.msg)
                }
            }
        });
        layer.close(index);
    });
}

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
                    if (data.code == 1) {
                        location.reload();
                    } else {
                        layer.msg(obj2.msg)
                    }
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
                    if (data.code == 1) {
                        location.reload();
                    } else {
                        layer.msg(obj2.msg)
                    }
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
                    if (data.code == 1) {
                        var index = obj.parentNode.rowIndex;
                        var table = document.getElementById("example1");
                        table.deleteRow(index)
                    } else {
                        layer.msg(data.msg)
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
            if (data.code == 1) {
                location.reload();
            } else {
                layer.msg(obj2.msg)
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
                var Str = '<textarea spellcheck="false" id="fopentxt" style="width:100%; height:720px; font-family:SimSun">' + obj.data + '</textarea>';
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
    layer.prompt({title: "输入文件夹名称"}, function (dname, index) {
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
    layer.prompt({title: "输入文件名称"}, function (dname, index) {
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


function deployplist() {
    $.ajax({
        type: 'post',
        url: '/deploy/projectmg',
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
                    trStr += '<td><p style="font-weight:bold">' + obj.data[i].project_name + '/' + obj.data[i].type + '</p></td> ';
                    trStr += '<td> ' + obj.data[i].add_time + '</td>';
                    trStr += '<td> ' + obj.data[i].up_time + '</td>';
                    trStr += '<td> <a class="btn btn-default btn-xs" onclick=deploypdel("'+obj.data[i].project_name+'")><i class="fa fa-fw fa-bitbucket-square"></i>删除</a> ' +
                        '<a class="btn btn-default btn-xs"><i class="fa fa-fw fa-edit"></i>编辑</a> ' +
                        '<a class="btn btn-default btn-xs"><i class="fa fa-fw fa-edit"></i>详情</a> ' +
                        '</td>';
                    trStr += '</tr> ';
                }
                $("#Project").html(trStr);
            }
        }
    });
}


function deploypdel(project_name) {
    layer.msg('你确定删除该项目?', {
        time: 0 //不自动关闭
        , btn: ['确定', '取消']
        , yes: function (index) {
            layer.close(index);
            $.ajax({
                type: 'post',
                url: '/deploy/projectmg',
                data: {
                    "project_name": project_name,
                    "action": 'delete'
                },
                dataType: 'json',
                success: function (js) {
                    //var obj = JSON.parse(js);
                    var obj = js;
                    if (obj.code == 1) {
                        deployplist()
                    } else {
                        layer.msg(obj.msg)
                    }
                }
            });
        }
    });
}

function deploy_poject_add_layer() {
    $.ajax({
        type: 'post',
        url: '/deploy/projectmg',
        data: {
            "action": 'listhosts'
        },
        dataType: 'json',
        success: function (js) {
            var Str_pro = '';
            var Str_pre = '';
            for (i = 0; i < js.data.length; i++) {
                Str_pro += '<label style="width: 20%"><input type="checkbox" value="' + js.data[i].hostname + '" name="Hosts_pro" style="vertical-align:middle;"> ' + js.data[i].hostname + '</label>';
                Str_pre += '<label style="width: 20%"><input type="checkbox" value="' + js.data[i].hostname + '" name="Hosts_pre" style="vertical-align:middle;"> ' + js.data[i].hostname + '</label>';
            }
            $("#projecthosts_pre").html(Str_pre);
            $("#projecthosts_pro").html(Str_pro);
        }
    });

    layer.open({
        type: 1,
        title: "添加部署项目",
        closeBtn: 0,
        area: ['80%', '50%'],
        skin: 'layui-layer-nobg', //没有背景色
        shadeClose: true,
        content: $('#deploypadd')
    });
}


function deploy_poject_add_post() {
    var project_type = document.getElementById("project_type").value;
    var project_name = document.getElementById("project_name").value;

    if (project_name == "") {
        layer.msg("请输入项目名称!")
    } else if (project_type == "") {
        layer.msg("请选择项目类型!")
    } else {
        obj_pro = document.getElementsByName("Hosts_pro");
        Hosts_pro = [];
        for (k in obj_pro) {
            if (obj_pro[k].checked)
                Hosts_pro.push(obj_pro[k].value);
        }
        obj_pre = document.getElementsByName("Hosts_pre");
        Hosts_pre = [];
        for (k in obj_pre) {
            if (obj_pre[k].checked)
                Hosts_pre.push(obj_pre[k].value);
        }
        $.ajax({
            type: 'post',
            url: '/deploy/projectmg',
            data: {
                "action": 'addproject',
                "project_type": project_type,
                "project_name": project_name,
                "Hosts_pro": Hosts_pro.toString(),
                "Hosts_pre": Hosts_pre.toString()
            },
            dataType: 'json',
            success: function (js) {
              var obj = js;
            if (obj.code == 1) {
                deployplist();
                layer.close(layer.index);
              }
            }
        });
    }
}




function deploypushlist() {
    $.ajax({
        type: 'post',
        url: '/deploy/projectmg',
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
                    trStr += '<td><p style="font-weight:bold">' + obj.data[i].project_name +'</p></td> ';
                    trStr += '<td> ' + obj.data[i].type + '</td>';
                    trStr += '<td> ' + obj.data[i].add_time + '</td>';

                    trStr += '<td> <a class="btn btn-default btn-xs" onclick=show_project_info("'+obj.data[i].id+'")><i class="fa fa-fw fa-cloud-upload"></i>生产发布</a> ' +
                        '<a class="btn btn-default btn-xs"><i class="fa fa-cloud-upload"></i>预生产发布</a> ' +
                        '</td>';
                    trStr += '</tr> ';
                }
                $("#Project").html(trStr);
                $('#pushdeploylogs').hide();
                $('#pushdeploylist').show();

            }
        }
    });
}

function show_project_info(project_id) {
    $.ajax({
        type: 'post',
        url: '/deploy/projectmg',
        data: {
            "action": 'sinfo',
            "project_id":project_id
        },
        dataType: 'json',
        success: function (js) {
            var obj = js;
            if (obj.code != 1) {
                layer.msg(obj.msg)
            } else {
                var dtrStr = '';
                for (i = 0; i < obj.qdata.length; i++) {
                    dtrStr += '<tr> ';
                    dtrStr += '<td> ' + obj.qdata[i].deploy_version + '</td>';
                    dtrStr += '<td><p style="font-weight:bold">' + obj.qdata[i].deploy_user +'</p></td> ';
                    dtrStr += '<td> ' + obj.qdata[i].deploy_time + '</td>';
                    dtrStr += '</tr> ';
                }

                var strStr = '';
                for (i = 0; i < obj.sdata.length; i++) {
                    var files='';
                    for( j=0;j< obj.sdata[i].changed_paths.length;j++){
                        files += obj.sdata[i].changed_paths[j].action+"---"+obj.sdata[i].changed_paths[j].path+'&#13;'
                    }

                    strStr += '<tr> ';
                    strStr += '<td> ' + obj.sdata[i].revision + '</td>';
                    strStr += '<td><p style="font-weight:bold">' + obj.sdata[i].author +'</p></td> ';
                    strStr += '<td> ' + obj.sdata[i].time + '</td>';
                    strStr += '<td> ' + obj.sdata[i].message + '</td>';
                    strStr += '<td> <a title='+files+'>显示变更文件</a></td>';
                    strStr += '<td> <a class="btn btn-default btn-xs" onclick=push_code("' + obj.project_id + '","' + obj.sdata[i].revision + '")><i class="fa fa-fw fa-cloud-upload"></i>发布</a> </td>';
                    strStr += '</tr> ';
                }

                $('#pushdeploylogs').show();
                $('#pushdeploylist').hide();
                $('#show_deploy_info').html("  显示最近"+ obj.qnum +"次");
                $('#push_project_name').html("<a> 项目名称："+ obj.project_name+"</a> <a> ;当前版本号："+obj.pro_version+"</a>");
                $('#show_svn_num').html("  显示最近"+ obj.snum +"次");
               $("#pushProjectinfo").html(dtrStr);
               $('#pushsinfo').html(strStr);
            }
        }
    });
}


function push_code(project_id,svn_revision) {
    $.ajax({
        type: 'post',
        url: '/deploy/projectmg',
        data: {
            "action": 'pcode',
            "project_id": project_id,
            "svn_revision":svn_revision
        },
        dataType: 'json',
        success: function (js) {
        }
    });

}
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
                    trStr += '<td> <a class="btn btn-default btn-xs" onclick=deploypdel("' + obj.data[i].project_name + '")><i class="fa fa-fw fa-bitbucket-square"></i>删除</a> ' +
                        '<a class="btn btn-default btn-xs" ><i class="fa fa-fw fa-edit"></i>编辑</a> ' +
                        '<a class="btn btn-default btn-xs" onclick=show_project_info("' + obj.data[i].id + '")><i class="fa fa-fw fa-edit"></i>详情</a> ' +
                        '</td>';
                    trStr += '</tr> ';
                }
                $("#Project").html(trStr);
            }
        }
    });
}


//查看项目详细信息
function show_project_info(project_id) {
    layer.load(1);
    $.ajax({
        type: 'post',
        url: '/deploy/projectmg',
        data: {
            "project_id": project_id,
            "action": 'pinfo'
        },
        dataType: 'json',
        success: function (js) {
            var obj = js;
            if (obj.code == 1) {
                layer.open({
                    type: 1,
                    area: ['820px', '400px'], //宽高
                    content: '<pre>' + syntaxHighlight(obj.data) + '</pre>'
                });
            } else {
                layer.msg(obj.msg)
            }
        }
    });


    setTimeout(function () {
        layer.closeAll('loading');
    }, 2000);

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
                    trStr += '<td><p style="font-weight:bold">' + obj.data[i].project_name + '</p></td> ';
                    trStr += '<td> ' + obj.data[i].type + '</td>';
                    trStr += '<td> ' + obj.data[i].add_time + '</td>';

                    trStr += '<td> <a class="btn btn-default btn-xs" onclick=show_project_data("' + obj.data[i].id + '")><i class="fa fa-fw fa-cloud-upload"></i>生产发布</a> ' +
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

function show_project_data(project_id) {
    $.ajax({
        type: 'post',
        url: '/deploy/projectmg',
        data: {
            "action": 'sinfo',
            "project_id": project_id
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
                    dtrStr += '<td><p style="font-weight:bold">' + obj.qdata[i].deploy_user + '</p></td> ';
                    dtrStr += '<td> ' + obj.qdata[i].deploy_time + '</td>';
                    dtrStr += '<td> <a href="#" onclick=push_show_log_info("' + obj.qdata[i].id + '")>点击显示</a></td>';
                    dtrStr += '</tr> ';
                }

                var strStr = '';
                for (i = 0; i < obj.sdata.length; i++) {
                    var files = '';
                    for (j = 0; j < obj.sdata[i].changed_paths.length; j++) {
                        files += obj.sdata[i].changed_paths[j].action + "---" + obj.sdata[i].changed_paths[j].path + '&#13;'
                    }

                    strStr += '<tr> ';
                    strStr += '<td> ' + obj.sdata[i].revision + '</td>';
                    strStr += '<td><p style="font-weight:bold">' + obj.sdata[i].author + '</p></td> ';
                    strStr += '<td> ' + obj.sdata[i].time + '</td>';
                    strStr += '<td> ' + obj.sdata[i].message + '</td>';
                    strStr += '<td> <a title=' + files + '>显示变更文件</a></td>';
                    strStr += '<td> <a class="btn btn-default btn-xs" onclick=push_code("' + obj.project_type + '","' + obj.project_id + '","' + obj.sdata[i].revision + '")><i class="fa fa-fw fa-cloud-upload"></i>发布</a> </td>';
                    strStr += '</tr> ';
                }

                $('#pushdeploylogs').show();
                $('#pushdeploylist').hide();
                $('#show_deploy_info').html("  显示最近" + obj.qnum + "次");
                $('#push_project_name').html('<a class=\"btn btn-default btn-xs\" > 项目名称："' + obj.project_name + '"</a> <a class=\"btn btn-default btn-xs\"> 当前版本号："' + obj.pro_version + '"</a>"+"<a class=\"btn btn-default btn-xs\" href=\'#\'  style=\'float:right\' onclick=show_log_set_host("'+ obj.project_id +'")><i class=\"fa fa-fw fa-comment-o\"></i>日志查看</a>');
                $('#show_svn_num').html("  显示最近" + obj.snum + "次");
                $("#pushProjectinfo").html(dtrStr);
                $('#pushsinfo').html(strStr);
            }
        }
    });
}


function show_log_set_host(project_id) {
    $.ajax({
        type: 'post',
        url: '/deploy/projectmg',
        data: {
            "project_id": project_id,
            "action": 'gethosts'
        },
        dataType: 'json',
        success: function (js) {
            var obj = js;
            if (obj.code == 1) {
                hostsp = obj.data.split(",");
                var str = '';
                for(var i = 0 ; i < hostsp.length; i++){
                    str += '<a class="btn btn-default btn-xs" style="width: 25%; margin-left:20px;" onclick=show_real_time_log("' + obj.project_name + '","' + hostsp[i] + '")><i class="fa fa-desktop"></i>'+hostsp[i]+'</a>'
                }
                layer.open({
                    title:"选择主机",
                    type: 1,
                    area: ['820px', '200px'], //宽高
                    content: '<div class="box-body" style="line-height:30px">' + str + '</div>'
                });
            } else {
                layer.msg(obj.msg)
            }
        }
    });
}

function show_real_time_log(project_name,host) {
    window.open("/logs/app?project_name="+project_name+"&host="+host);

}


function push_code(project_type, project_id, svn_revision) {
    if (project_type == "php") {
        layer.msg('确定发布该版本?', {
            time: 0 //不自动关闭
            , btn: ['确定', '取消']
            , yes: function (index) {
                layer.msg("代码发布中，请稍后....", {time: 0});
                layer.close(index);
                $.ajax({
                    type: 'post',
                    url: '/deploy/projectmg',
                    data: {
                        "action": 'pcode',
                        "project_id": project_id,
                        "svn_revision": svn_revision,
                        "restart": "n"
                    },
                    dataType: 'json',
                    success: function (js) {
                        var obj = js;
                        if (obj.code != 1) {
                            layer.msg(obj.msg)
                        } else {
                            layer.open({
                                type: 1,
                                area: ['820px', '840px'], //宽高
                                content: '<pre>' + obj.data + '</pre>'
                            });
                            layer.msg("代码发布完成,数据请求更新");
                            show_project_data(project_id)
                        }
                    }
                });
                layer.close(index);
            }
        });

    } else {
        layer.prompt({title: "是否重启[y/n]"}, function (restart, index) {
            layer.msg("代码发布中，请稍后....", {time: 0});
            $.ajax({
                type: 'post',
                url: '/deploy/projectmg',
                data: {
                    "action": 'pcode',
                    "project_id": project_id,
                    "svn_revision": svn_revision,
                    "restart": restart
                },
                dataType: 'json',
                success: function (js) {
                    var obj = js;
                    if (obj.code != 1) {
                        layer.msg(obj.msg)
                    } else {
                        layer.open({
                            type: 1,
                            area: ['820px', '840px'], //宽高
                            content: '<pre>' + obj.data + '</pre>'
                        });
                        layer.msg("代码发布完成,数据请求更新");
                        show_project_data(project_id)
                    }
                }
            });
            layer.close(index);
        });
    }
}


function push_show_log_info(log_id) {
    $.ajax({
        type: 'post',
        url: '/deploy/projectmg',
        data: {
            "action": 'loginfo',
            "log_id": log_id
        },
        dataType: 'json',
        success: function (js) {
            var obj = js;
            if (obj.code != 1) {
                layer.msg(obj.msg)
            } else {
                layer.open({
                    type: 1,
                    area: ['820px', '840px'], //宽高
                    content: '<pre>' + obj.data + '</pre>'
                });
            }
        }
    });

}
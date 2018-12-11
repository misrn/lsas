function _file_list() {
    $.ajax({
        type: 'post',
        url: '/host/filemg',
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
                    trStr += '<td><p style="font-weight:bold">' + obj.data[i].file_name + '</p></td> ';
                    trStr += '<td> ' + obj.data[i].salt_mode + '</td>';
                    trStr += '<td> ' + obj.data[i].create_time + '</td>';
                    trStr += '<td> ' + obj.data[i].up_time + '</td>';
                    trStr += '<td> <a class="btn btn-default btn-xs" href=\'#\' onclick=file_hosts_show("' + obj.data[i].id + '")><i class="fa fa-fw fa-comment-o"></i>关联主机</a> </td>';
                    trStr += '<td> <a class="btn btn-default btn-xs" href=\'#\' onclick=file_Push_post("' + obj.data[i].id + '")><i class="fa fa-fw fa-comment-o"></i>推送</a> </td>';
                    trStr += '<td><a class="btn btn-default btn-xs" onclick=del_file("' + obj.data[i].id + '")><i class="fa fa-fw fa-bitbucket-square"></i>删除</a>  ' +
                        '<a class="btn btn-default btn-xs" onclick=Remove_("' + obj.data[i].id + '")><i class="fa fa-fw fa-bitbucket-square"></i>卸载</a> ' +
                        ' <a class="btn btn-default btn-xs" onclick=History_("' + obj.data[i].id + '")><i class="fa fa-fw fa-comment-o"></i>历史</a> ' + '</td>'
                    ;
                    trStr += '</tr> ';
                }
                $("#host-file-list").html(trStr);
            }
        }
    });

}

function Remove_(id) {

    layer.msg('确定卸载?', {
        time: 0 //不自动关闭
        , btn: ['确定', '取消']
        , yes: function (index) {
            layer.msg("脚本执行中，请稍后....", {time: 0});
            layer.close(index);
            $.ajax({
                type: 'post',
                url: '/host/filemg',
                data: {
                    "action": 'remove',
                    "id": id
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
                            content: '<pre>' + syntaxHighlight(js.data) + '</pre>'
                        });
                        layer.msg("脚本执行完成,数据请求更新");
                    }
                }
            });
        }
    });
}

function History_(id){
    $.ajax({
        type: 'post',
        url: '/host/filemg',
        data: {
            "id": id,
            "action": 'History_'
        },
        dataType: 'json',
        success: function (js) {
            if (js.code == 1) {
                var str = '';
                for (i = 0; i < js.data.length; i++) {
                    str += '<p> '+ js.data[i].time +'---------' +js.data[i].tex +'</p>'
                }

                layer.open({
                    type: 1,
                    area: ['820px', '338px'], //宽高
                    content: '<div class="content">' + str + '</div>'
                });
            }

        }
    });

}


 // 显示关联主机列表
function file_hosts_show(id) {
    $.ajax({
        type: 'post',
        url: '/host/filemg',
        data: {
            "id": id,
            "action": 'listhosts'
        },
        dataType: 'json',
        success: function (js) {
            var str = '';
            for (i = 0; i < js.data.length; i++) {
                if (js.data[i].enable == "true"){
                    str += '<label style="width: 20%"><input type="checkbox" value="' + js.data[i].hostname + '" name="Hosts" style="vertical-align:middle;" checked> ' + js.data[i].hostname + '</label>';
                }else if (js.data[i].enable == "false"){
                    str += '<label style="width: 20%"><input type="checkbox" value="' + js.data[i].hostname + '" name="Hosts" style="vertical-align:middle;"> ' + js.data[i].hostname + '</label>';
                }
            }
            layer.open({
                type: 1,
                area: ['820px', '338px'], //宽高
                content: '<div class="box-footer"><div class="content">' + str + '</div>    <div >\n' +
                '                    <a href="#" class="btn btn-default btn-xs" style="float:right"\n' +
                '                       onclick="file_hosts_post(' + id + ' )"><i class="fa fa-fw fa-save"></i>确定</a>\n' +
                '                </div></div>'
            });

        }
    });
}

// 更新主机hosts列表
function file_hosts_post(id) {
    obj_pro = document.getElementsByName("Hosts");
    Hosts = [];
    for (k in obj_pro) {
        if (obj_pro[k].checked)
            Hosts.push(obj_pro[k].value);
    }
    $.ajax({
        type: 'post',
        url: '/host/filemg',
        data: {
            "action": 'uphost',
            "id": id,
            "Hosts": Hosts.toString()
        },
        dataType: 'json',
        success: function (js) {
            layer.close(layer.index);
            layer.msg(js.msg)
        }
    });
}


// 推送到主机

function file_Push_post(id) {

    layer.msg('确定推送?', {
        time: 0 //不自动关闭
        , btn: ['确定', '取消']
        , yes: function (index) {
            layer.msg("脚本执行中，请稍后....", {time: 0});
            layer.close(index);
            $.ajax({
                type: 'post',
                url: '/host/filemg',
                data: {
                    "action": 'push',
                    "id": id
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
                            content: '<pre>' + syntaxHighlight(js.data) + '</pre>'
                        });
                        layer.msg("脚本执行完成,数据请求更新");
                    }
                }
            });
        }
    });
}



function del_file(id) {
    layer.msg('你确定删除?', {
        time: 0 //不自动关闭
        , btn: ['确定', '取消']
        , yes: function (index) {
            layer.close(index);
            $.ajax({
                type: 'post',
                url: '/host/filemg',
                data: {
                    "id": id,
                    "action": 'delete'
                },
                dataType: 'json',
                success: function (js) {
                    var obj = js;
                    if (obj.code == 1) {
                        _file_list();
                    } else {
                        layer.msg(obj.msg)
                    }
                }
            });
        }
    });
}

function file_add_layer() {
    $.ajax({
        type: 'post',
        url: '/host/filemg',
        data: {
            "id": "",
            "action": 'listhall'
        },
        dataType: 'json',
        success: function (js) {
            var str = '';
            for (i = 0; i < js.data.length; i++) {
                str += '<label style="width: 20%"><input type="checkbox" value="' + js.data[i].hostname + '" name="FileHost" style="vertical-align:middle;"> ' + js.data[i].hostname + '</label>';
               }
            $("#LnHosts").html(str);
        }
    });

    layer.open({
        type: 1,
        title: "添加",
        closeBtn: 0,
        area: ['80%', '400px'],
        skin: 'white', //没有背景色
        shadeClose: true,
        content: $('#addmode')
    });
}

function file_add_post(){
    var FileName = document.getElementById("FileName").value;
    var SaltMode = document.getElementById("SaltMode").value;

    if (FileName == "") {
        layer.msg("请输入项目名称!")
    } else if (SaltMode == "") {
        layer.msg("请输入Salt模块!")
    } else {
        obj_pro = document.getElementsByName("FileHost");
        Hosts_pro = [];
        for (k in obj_pro) {
            if (obj_pro[k].checked)
                Hosts_pro.push(obj_pro[k].value);
        }
        $.ajax({
            type: 'post',
            url: '/host/filemg',
            data: {
                "action": 'add',
                "FileName": FileName,
                "SaltMode": SaltMode,
                "FileHost": Hosts_pro.toString()
            },
            dataType: 'json',
            success: function (js) {
                var obj = js;
                if (obj.code == 1) {
                    _file_list();
                    layer.close(layer.index);
                }
                    layer.msg(js.msg)

            }
        });
    }
}
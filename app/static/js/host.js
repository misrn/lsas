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
                    trStr += '<td> ' + obj.data[i].file_path + '</td>';
                    trStr += '<td> ' + obj.data[i].file_user + '</td>';
                    trStr += '<td> ' + obj.data[i].file_group + '</td>';
                    trStr += '<td> ' + obj.data[i].file_node + '</td>';
                    trStr += '<td> ' + obj.data[i].create_time + '</td>';
                    trStr += '<td> ' + obj.data[i].up_time + '</td>';
                    trStr += '<td> <a class="btn btn-default btn-xs" href=\'#\' onclick=showtxt("' + obj.data[i].id + '")><i class="fa fa-fw fa-comment-o"></i>内容查看</a> </td>';
                    trStr += '<td> <a class="btn btn-default btn-xs" href=\'#\' onclick=file_Push_show("' + obj.data[i].id + '")><i class="fa fa-fw fa-comment-o"></i>推送</a> </td>';
                    trStr += '<td onclick=hostsinfo("' + obj.data[i].hostname + '")><a href="#"> <span class="label label-info" ><i class="fa fa-fw fa-bars"></i>关联主机</span></a></td>';
                    trStr += '</tr> ';
                }
                $("#host-file-list").html(trStr);
            }
        }
    });

}


function file_Push_show(id) {
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
                str += '<label style="width: 20%"><input type="checkbox" value="' + js.data[i].hostname + '" name="Hosts" style="vertical-align:middle;"> ' + js.data[i].hostname + '</label>';
                }

            layer.open({
                type: 1,
                area: ['820px', '338px'], //宽高
                content: '<div class="box-footer"><div class="content">' + str + '</div>    <div >\n' +
                '                    <a href="#" class="btn btn-default btn-xs" style="float:right"\n' +
                '                       onclick="file_Push_post('+ id +' )"><i class="fa fa-fw fa-save"></i>确定</a>\n' +
                '                </div></div>'
            });

        }
    });
}

function file_Push_post(id) {
    obj_pro = document.getElementsByName("Hosts");
    Hosts = [];
    for (k in obj_pro) {
        if (obj_pro[k].checked)
            Hosts.push(obj_pro[k].value);
    }

    alert(Hosts);

    $.ajax({
        type: 'post',
        url: '/host/filemg',
        data: {
            "action": 'push',
            "id": id,
            "Hosts": Hosts.toString()
        },
        dataType: 'json',
        success: function (js) {
            var obj = js;
            if (obj.code == 1) {
                layer.close(layer.index);
            }else {
                layer.msg(js.msg)
            }
        }
    });

}


function showtxt(id) {
    layer.load(1);
    $.ajax({
        type: 'post',
        url: '/host/filemg',
        data: {
            "id": id,
            "action": 'showtxt'
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
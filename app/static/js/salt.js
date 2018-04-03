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
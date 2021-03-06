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
                $('#Navigation').html(SrtNavigation);
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
                var addbutth = '<a class="btn btn-default btn-xs" onclick=returnd("' + path + '")><i class="fa fa-fw  fa-caret-square-o-left"></i> 返回上一级</a>'+                                                                   ' <a class="btn btn-default btn-xs" onclick=saltdadd("' + path + '")><i class="fa fa-fw  fa-folder-open"></i> 创建文件夹</a>' +
                    ' <a class="btn btn-default btn-xs" onclick=saltfadd("' + path + '")><i class="fa fa-fw  fa-file"></i> 创建文件</a> <a class="btn btn-default btn-xs" onclick=saltsvnstatus()><i class="fa fa-fw  fa-caret-square-o-up"></i> 提交仓库</a>';
                $('#list').show();
                $('#edit').hide();
                $('#salt_svn_info').hide();
                $("#locapath").html(locapath); //更改目录导航
                $("#filelist").html(trStr);
                $("#add-new-path").html(addbutth);
            }
        }
    });
}

function saltsvnstatus(){
        $.ajax({
            type: 'post',
            url: '/salt/svnmg',
            data: {
                "action": 'status',
            },
            dataType: 'json',
            success: function (js) {
                //var obj = JSON.parse(js);
                var obj = js;
                if (obj.code == 1) {
                   var Str = '<input type="checkbox"  id="hxy" onclick="salt_on()"/>全选/不全选';
                   for (i = 0; i < js.data.length; i++) {
                      Str += '<label style="width: 100%;font-weight:40;font-family:courier"><input type="checkbox" value="' + js.data[i] + '" name="svn_path" style="font-weight:1;">'+ js.data[i]+'</label>'
                   }
                   $("#salt_show_svn_st").html(Str);
                   $('#list').hide();
                   $('#salt_svn_info').show();
                } else {
                    layer.msg(obj.msg)
                }
            }
        });
}

function salt_on(){
   var ch=document.getElementsByName("svn_path");
   if(document.getElementById("hxy").checked){
      for (var i=0;i<ch.length;i++){
          ch[i].checked=true;
      }
   } else {
      for (var i=0;i<ch.length;i++){
          ch[i].checked=false;
      }
   }
}

function saltsvnci(){
        var ci_name = document.getElementById("ci_name").value;
        var ci_passwd = document.getElementById("ci_passwd").value;
        var ci_text = document.getElementById("ci_text").value;
        if (ci_name == ""){
            layer.msg("请输入svn账户!")  
        } else if (ci_passwd == ""){
            layer.msg("请输入svn密码!")
        } else if (ci_text == ""){
            layer.msg("请输入本次提交备注!")
        } else {



        obj = document.getElementsByName("svn_path");
        paths = [];
        for (k in obj) {
            if (obj[k].checked)
                paths.push(obj[k].value);
        }
        $.ajax({
            type: 'post',
            url: '/salt/svnmg',
            data: {
                "action": 'commit',
                "paths": paths.toString(),
                "ci_text": ci_text,
                "ci_passwd": ci_passwd,
                "ci_name": ci_name
            },  
            dataType: 'json',
            success: function (js) {
                //var obj = JSON.parse(js);
                var obj = js;
                if (obj.code == 1) {
                    saltsvnstatus();
                    layer.open({
                    type: 1,
                    area: ['820px', '840px'], //宽高
                    content: '<pre>' + obj.data + '</pre>'
                    });
                } else {
                    layer.msg(obj.msg)
                }
            }
        });
}
}




function returnd(path) {
    saltlistdir(path.substr(0, path.lastIndexOf('/')))
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

function salt_cmd_mode_type(){
    if(document.getElementById("salt_cmd_mode_type").checked){
    $('#salt_cmd_mode_text').show();
    $('#salt_cmd_mode_select').hide();
   }else{
    $('#salt_cmd_mode_select').show();
    $('#salt_cmd_mode_text').hide();
   }

}


function salt_cmd_post(){
        sal_cmd_hosts = document.getElementsByName("sal_cmd_hosts");
        Hosts = [];
        for (k in sal_cmd_hosts) {
            if (sal_cmd_hosts[k].checked)
                Hosts.push(sal_cmd_hosts[k].value);
        }

        if(document.getElementById("salt_cmd_mode_type").checked){
           var salt_cmd_mode_info = document.getElementById("salt_cmd_mode_text_info").value;
        }else {
           var salt_cmd_mode_info = document.getElementById("salt_cmd_mode_select_info").value;
        }

        var salt_cmd_mode = document.getElementById("salt_cmd_mode").value;

        if (Hosts.length == 0){
           layer.msg("请选择主机!")
        }

        else if (salt_cmd_mode == ""){
           layer.msg("请选择模块!")
        }


        else if (salt_cmd_mode_info == ""){
           layer.msg("请输入/选择命令!")
        } else {
              layer.msg("数据加载中，请稍后....", {time: 0});
              $.ajax({
                     type: 'post',
                     url: '/salt/cmdmg',
                     data: {
                         "action": 'cmd_execute',
                         "hosts": Hosts.toString(),
                         "salt_cmd_mode": salt_cmd_mode,
                         "salt_cmd_mode_info": salt_cmd_mode_info
                     },
                     dataType: 'json',
                     success: function (res) {
                     layer.msg("数据加载完成!");
                     if (res.code == 1) {
                         if (res.mode == "json"){
                             layer.open({
                                 type: 1,
                                 area: ['820px', '840px'], //宽高
                                 content: '<pre>' + syntaxHighlight(res.data) + '</pre>'
                         });
                     }else {
                           layer.open({
                               type: 1,
                               area: ['820px', '840px'], //宽高
                               content: '<pre>' + res.data + '</pre>'
                           });

                    }
                    } else {
                         layer.msg(res.data)
                    }

                    }
              });
        }
}


function salt_cmd_info() {
    $.ajax({
        type: 'post',
        url: '/salt/cmdmg',
        data: {
            "action": 'info'
        },
        dataType: 'json',
        success: function (js) {
            if (js.code == "1"){
            var host_html = '';
            for (i = 0; i < js.data.length; i++) {
                host_html += '<label style="width: 20%"><input type="checkbox" value="' + js.data[i].hostname + '" name="sal_cmd_hosts" style="vertical-align:middle;"> ' + js.data[i].hostname + '</label>';
            }
            var cmd_html = '<select class="form-control" name="salt_cmd_mode_info" id="salt_cmd_mode_select_info">' + ' <option value="" disabled selected style="color: #b6b6b6" >请选择</option>';
            
            for (i = 0; i < js.sdata.length; i++) {
                cmd_html += '<option value="'+ js.sdata[i]+'">'+ js.sdata[i] +'</option>'; 
            }
            cmd_html += '</select>';
            $("#salt_cmd_mode_select").html(cmd_html);
            $("#salt_cmd_host").html(host_html);
        }else {
              layer.msg(js.msg)
         }
     }
    });
}

function salt_host_on(){
   var ch=document.getElementsByName("sal_cmd_hosts");
   if(document.getElementById("hxy_host").checked){
      for (var i=0;i<ch.length;i++){
          ch[i].checked=true;
      }
   } else {
      for (var i=0;i<ch.length;i++){
          ch[i].checked=false;
      }
   }
}

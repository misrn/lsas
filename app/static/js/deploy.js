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
                    trStr += '<td> <a class="btn btn-default btn-xs" href=\'#\' onclick=show_log_set_host("'+ obj.data[i].id +'")><i class="fa fa-fw fa-comment-o"></i>生产日志</a> '+
                        '<a class="btn btn-default btn-xs" onclick=deploypdel("' + obj.data[i].project_name + '")><i class="fa fa-fw fa-bitbucket-square"></i>删除</a> ' +
                        '<a class="btn btn-default btn-xs" onclick=deploy_poject_edit_layer("'+ obj.data[i].id +'")><i class="fa fa-fw fa-edit"></i>编辑</a> ' +
                        '<a class="btn btn-default btn-xs" onclick=show_project_info("' + obj.data[i].id + '")><i class="fa fa-fw fa-bars"></i>详情</a> ' +
                        '</td>';
                    trStr += '</tr> ';
                }
                $("#Project").html(trStr);
            }
        }
    });
}

function diff(arr,arr1){
    var a=[];var b=[];var r;
    for(var i=0;i<arr.length;i++){
        var index=arr1.indexOf(arr[i]);
        if(index!=-1){
            var r=a[i];
            for(var j=index;j<arr1.length;j++){
                if(arr1[j]==arr[i]){
                    arr1.splice(j,1);
                    j=j-1;
                }
            }
            for(var k=i+1;k<arr.length;k++){
                if(arr[k]==arr[i]){
                    arr.splice(k,1);
                    k=k-1;
                }
            }
            arr.splice(i,1);
            i=i-1;
        }
    }
    return arr.concat(arr1);
}
function deploy_poject_edit_layer(project_id){

    var hostsliste = [];var hostslisto = [];
    $.ajax({
        type: 'post',
        url: '/deploy/projectmg',
        data: {
            "action": 'listhosts'
        },
        dataType: 'json',
        success: function (ho) {
        if (ho.code == 1){
            for (i = 0; i < ho.data.length; i++){
                hostsliste[i]=ho.data[i].hostname;
                hostslisto[i]=ho.data[i].hostname
            }
            $.ajax({
                type: 'post',
                url: '/deploy/projectmg',
                data: {
                    "action": 'pinfo',
                    "project_id":project_id
                },
                dataType: 'json',
                success: function (js) {
                    if (js.code == 1){
                    var Str_pro = '';
                    var Str_pre = '';
                    //预生产
                    if (js.sdata.pre_hosts == ""){
                         for (i =0 ; i < hostsliste.length; i++){
                              Str_pre += '<label style="width: 20%"><input type="checkbox" value="' + hostsliste[i] + '" name="Hosts_pre_edit" style="vertical-align:middle;"> ' + hostsliste[i] + '</label>';
                         }
                    }else {
                        var preih= js.sdata.pre_hosts.split(",");
                        var preoh=diff(hostsliste,js.sdata.pre_hosts.split(","));
                        for (i =0 ; i < preih.length; i++){
                            Str_pre += '<label style="width: 20%"><input type="checkbox" value="' + preih[i] + '" name="Hosts_pre_edit" style="vertical-align:middle;" checked="checked"> ' + preih[i] + '</label>';
                        }
                        for (i =0 ; i < preoh.length; i++) {
                            Str_pre += '<label style="width: 20%"><input type="checkbox" value="' + preoh[i] + '" name="Hosts_pre_edit" style="vertical-align:middle;"> ' + preoh[i] + '</label>';
                        }
                    }
                    //生产
                    if (js.sdata.pro_hosts == ""){
                         for (i =0 ; i < hostslisto.length; i++){
                              Str_pro += '<label style="width: 20%"><input type="checkbox" value="' + hostslisto[i] + '" name="Hosts_pro_edit" style="vertical-align:middle;"> '+ hostslisto[i] + '</label>';
                         }
                    }else {

                        var proih= js.sdata.pro_hosts.split(",");
                        var prooh=diff(hostslisto,js.sdata.pro_hosts.split(","));     
                        for (i =0 ; i < proih.length; i++){
                            Str_pro += '<label style="width: 20%"><input type="checkbox" value="' + proih[i] + '" name="Hosts_pro_edit" style="vertical-align:middle;" checked="checked"> ' + proih[i] + '</label>';
                        }
                        for (i =0 ; i < prooh.length; i++) {
                            Str_pro += '<label style="width: 20%"><input type="checkbox" value="' + prooh[i] + '" name="Hosts_pro_edit" style="vertical-align:middle;"> ' + prooh[i] + '</label>';
                        }
                    }

                    $("#projecthosts_pre_edit").html(Str_pre);
                    $("#projecthosts_pro_edit").html(Str_pro);
                    $("#edit_name").html("正在编辑的项目的名称：<input type=\"text\" name=\"edit_names\" id=\"edit_names\" disabled value='"+ js.sdata.project_name +"'>");

                    layer.open({
                        type: 1,
                        title: "编辑项目",
                        closeBtn: 0,
                        area: ['1400px', '300px'],
                        skin: 'white', //没有背景色
                        shadeClose: true,
                        content: $('#deployedit')
                    });
                    }else{
                        layer.msg(js.msg)
                    }
                }
            });
            }else{
                 layer.msg(js.msg)
            }
        }
    });
}

function deploy_poject_edit_post(){
    $project_name = document.getElementById("edit_names").value;
    obj_pro = document.getElementsByName("Hosts_pro_edit");
    Hosts_pro = [];
    for (k in obj_pro) {
        if (obj_pro[k].checked)
            Hosts_pro.push(obj_pro[k].value);
    }
    obj_pre = document.getElementsByName("Hosts_pre_edit");
    Hosts_pre = [];
    for (k in obj_pre) {
        if (obj_pre[k].checked)
            Hosts_pre.push(obj_pre[k].value);
    }
    $.ajax({
        type: 'post',
        url: '/deploy/projectmg',
        data: {
            "action": 'editproject',
            "project_name": $project_name,
            "Hosts_pro": Hosts_pro.toString(),
            "Hosts_pre": Hosts_pre.toString()
        },
        dataType: 'json',
        success: function (js) {
            var obj = js;
            if (obj.code == 1) {
                layer.close(layer.index);
                deployplist();
                layer.msg("编辑成功!");
            }else {
                layer.msg(js.msg)
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
        area: ['80%', '400px'],
        skin: 'white', //没有背景色
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
                }else {
                    layer.msg(js.msg)
                }
            }
        });
    }
}


function deploypushlist() {
    $.ajax({
        type: 'post',
        url: '/deploy/pushmg',
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
        url: '/deploy/pushmg',
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
                    strStr += '<td> <a class="btn btn-default btn-xs" onclick=deploy_select_hosts("' + obj.project_type + '","' + obj.project_id + '","' + obj.sdata[i].revision + '")><i class="fa fa-fw fa-cloud-upload"></i>发布</a> </td>';
                    strStr += '</tr> ';
                }

                $('#pushdeploylogs').show();
                $('#pushdeploylist').hide();
                $('#show_deploy_info').html("  显示最近" + obj.qnum + "次");
                $('#push_project_name').html('<a class=\"btn btn-default btn-xs\" > 项目名称："' + obj.project_name + '"</a> <a class=\"btn btn-default btn-xs\"> 当前版本号："' + obj.pro_version + '"</a><a class=\"btn btn-default btn-xs\" href=\'#\'  style=\'float:right\' onclick=show_log_set_host("'+ obj.project_id +'")><i class=\"fa fa-fw fa-comment-o\"></i>日志查看</a>');
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



function deploy_select_hosts(type,project_id,revision) {
       var hostsliste = [];
        $.ajax({
        type: 'post',
        url: '/deploy/pushmg',
        data: {
            "project_id": project_id,
            "action": 'selecthost'
        },
        dataType: 'json',
        success: function (js) {
          if (js.code == 1){
          for (i = 0; i < js.data.length; i++){
                hostsliste[i]=js.data[i].hostname;
            }
         var Str = '<div class="box-footer" > <div class="form-group"> <div class="checkbox"> ';
          for (i =0 ; i < hostsliste.length; i++){
              Str += '<label style="width: 50%"><input type="checkbox" value="' + hostsliste[i] + '" name="SelectHost" style="vertical-align:middle;"> ' + hostsliste[i] + '</label>';
           }
          Str += '</div> </div> <div> <a href="#" class="btn btn-default btn-xs" style="float:right" onclick=show_infos("' + type + '","' + project_id + '","' + revision + '")><i class="fa fa-fw fa-save"></i>确定</a> </div> </div>'


layer.open({
  title: "选择需要重启的主机",
  type: 1,
  skin: 'layui-layer-demo', //样式类名
  closeBtn: 0, //不显示关闭按钮
  area: ['700px', '133px'],
  shadeClose: true, //开启遮罩关闭
  content: Str
});}}})}


function show_infos(type,project_id,revision){
    data = document.getElementsByName("SelectHost");
    Hosts = [];
    for (k in data) {
        if (data[k].checked)
            Hosts.push(data[k].value);
    }

    push_code(type,project_id,revision,Hosts.toString())
}


function push_code(project_type, project_id, svn_revision , hosts) {
    if (project_type == "php") {
        layer.msg('确定发布该版本?', {
            time: 0 //不自动关闭
            , btn: ['确定', '取消']
            , yes: function (index) {
                layer.msg("代码发布中，请稍后....", {time: 0});
                layer.close(index);
                $.ajax({
                    type: 'post',
                    url: '/deploy/pushmg',
                    data: {
                        "action": 'pcode',
                        "project_id": project_id,
                        "svn_revision": svn_revision,
                        "restart": "n",
                        "restarthost": hosts
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
            }
        });

    } else {
            layer.msg("代码发布中，请稍后....", {time: 0});
            $.ajax({
                type: 'post',
                url: '/deploy/pushmg',
                data: {
                    "action": 'pcode',
                    "project_id": project_id,
                    "svn_revision": svn_revision,
                    "restart": 'y',
                    "restarthost": hosts
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
    }
}


function push_show_log_info(log_id) {
    $.ajax({
        type: 'post',
        url: '/deploy/pushmg',
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

function sys_user_list_show() {  //显示所有角色
    $.ajax({
        type: 'post',
        url: '/sys/users_mg',
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
                    trStr += '<td><p style="font-weight:bold">' + obj.data[i].full_name + '</p></td> ';
                    trStr += '<td><p style="font-weight:bold">' + obj.data[i].email + '</p></td> ';
                    trStr += '<td><p style="font-weight:bold">' + obj.data[i].role + '</p></td> ';
                    if (obj.data[i].active == "1"){
                        trStr += '<td><span class="label label-success">正常</span></td>';
                    }else if(obj.data[i].active =="0"){
                        trStr += '<td><span class="label label-danger">禁用</span></td>';
                    }else {
                        trStr += '<td> <span class="label label-warning">未知</span></td>';
                    }

                    trStr += '<td> ' + obj.data[i].add_time + '</td>';
                    trStr += '<td> ' + obj.data[i].login_time + '</td>';
                    trStr += '<td> <a class="btn btn-default btn-xs" onclick=sys_user_del_post("'+ obj.data[i].id +'")><i class="fa fa-fw fa-bitbucket-square"></i>删除</a> ' +
                        '<a class="btn btn-default btn-xs" onclick=sys_user_edit_show("' + obj.data[i].id + '","'+ obj.data[i].email +'","'+ obj.data[i].role_id +'","'+ obj.data[i].full_name +'","'+obj.data[i].active+'")><i class="fa fa-fw fa-edit"></i>编辑</a> ' +
                        //'<a class="btn btn-default btn-xs" onclick=show_project_info("' + obj.data[i].id + '")><i class="fa fa-fw fa-bars"></i>详情</a> ' +
                        '</td>';
                    trStr += '</tr> ';
                }
                $("#sys-user-list").html(trStr);
            }
        }
    });
}

function sys_user_edit_show(id,emails,role_id,full_name,active) {
    $.ajax({
        type: 'post',
        url: '/sys/role_mg',
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
                    if (obj.data[i].id == role_id){
                        trStr += '<option selected value="'+obj.data[i].id +'">'+obj.data[i].role_name+'</option>';
                    }else {
                        trStr += '<option value="'+obj.data[i].id +'">'+obj.data[i].role_name+'</option>';
                    }
                }
                $("#sys-user-role-edit").html(trStr);
            }
        }
    });
    var Srt = '';
    if (active == "1"){
        Srt+='<input type="checkbox" id="user-active-edit" onclick="salt_cmd_mode_type()" checked> 启用'
    }else if (active == "0"){
        Srt+='<input type="checkbox" id="user-active-edit" onclick="salt_cmd_mode_type()"> 启用'
    }

    $("#user-edit-status").html(Srt);
    document.getElementById("sys-user-email-edit").value = emails;
    document.getElementById("sys-user-name-edit").value = full_name;

    $("#sys-user-edit-buttn").html('<a href="#" class="btn btn-default btn-xs" style="float:right" onclick=sys_user_edit_post("'+ id +'")><i class="fa fa-fw fa-save"></i>保存</a>');
    layer.open({
        type: 1,
        title: "编辑用户",
        closeBtn: 0,
        area: ['60%', '225px'],
        skin: 'white',
        shadeClose: true,
        content: $('#sys-user-edit')
    });
}

function sys_user_edit_post(id){
    var user_email = document.getElementById("sys-user-email-edit").value;
    var user_name = document.getElementById("sys-user-name-edit").value;
    var user_role = document.getElementById("sys-user-role-edit").value;
    if(document.getElementById("user-active-edit").checked){
        var active = 1
    }else {
        var active = 0
    }

    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (user_email == ""){
        layer.msg("用户邮箱不能为空!")
    }else if(!myreg.test(user_email)){
        layer.msg("邮箱地址不合法!")
    }else if (user_name == ""){
        layer.msg("用户名不能为空!")
    }else if(user_role == ""){
        layer.msg("请选择用户角色!")
    }else {
        $.ajax({
            type: 'post',
            url: '/sys/users_mg',
            data: {
                "id":id,
                "action": 'edit',
                "user_email": user_email,
                "user_name": user_name,
                "user_role":user_role,
                "active":active
            },
            dataType: 'json',
            success: function (js) {
                var obj = js;
                if (obj.code == 1) {
                    sys_user_list_show();
                    layer.msg("编辑成功!");
                } else {
                    layer.msg(js.msg)
                }
            }
        });
    }
}

function sys_roles_list_show() {  //显示所有角色
    $.ajax({
        type: 'post',
        url: '/sys/role_mg',
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
                    trStr += '<td><p style="font-weight:bold">' + obj.data[i].role_text + '</p></td> ';
                    trStr += '<td> ' + obj.data[i].role_name + '</td>';
                    trStr += '<td> ' + obj.data[i].create_time + '</td>';
                    trStr += '<td> <a class="btn btn-default btn-xs" onclick=sys_roles_jdc_show("'+ obj.data[i].id +'","'+ obj.data[i].role_name +'")><i class="fa fa-fw fa-bitbucket-square"></i>权限管理</a>' +
                        '<a class="btn btn-default btn-xs" onclick=sys_roles_del_post("'+ obj.data[i].id +'")><i class="fa fa-fw fa-bitbucket-square"></i>删除</a> ' +
                        '<a class="btn btn-default btn-xs" onclick=sys_roles_edit_show("' + obj.data[i].id + '","'+ obj.data[i].role_name +'","'+ obj.data[i].role_text +'")><i class="fa fa-fw fa-edit"></i>编辑</a> ' +
                        '</td>';
                    trStr += '</tr> ';
                }
                $("#sys-roles").html(trStr);
            }
        }
    });
}

function sys_role_jdc_add(role_id,jurisdiction_text,role_name) {
    $.ajax({
        type: 'post',
        url: '/sys/role_mg',
        data: {
            "action": 'jdcadd',
            "id": role_id,
            "jurisdiction_text":jurisdiction_text
        },
        dataType: 'json',
        success: function (obj) {
            if (obj.code == 1) {
                $.ajax({
                    type: 'post',
                    url: '/sys/role_mg',
                    data: {
                        "action": 'listjdc',
                        "id": role_id
                    },
                    dataType: 'json',
                    success: function (obj) {
                        if (obj.code == 1) {
                            var role_jdc = '';
                            var role_not_jdc = '';
                            for (i = 0; i < obj.role_jdc.length; i++) {
                                role_jdc += '<a class="btn btn-default btn-xs" style="margin-bottom:20px;width: 20%;margin-left:20px" onclick=sys_role_jdc_del("'+role_id+'","'+ obj.role_jdc[i].jurisdiction_text+ '","' + role_name + '")>' + obj.role_jdc[i].jurisdiction_name + '</a>'
                            }
                            for (i = 0; i < obj.role_not_jdc.length; i++) {
                                role_not_jdc += '<a class="btn btn-default btn-xs" style="margin-bottom:20px;width: 20%;margin-left:20px" onclick=sys_role_jdc_add("' + role_id + '","' + obj.role_not_jdc[i].jurisdiction_text + '","' + role_name + '")>' + obj.role_not_jdc[i].jurisdiction_name + '</a>'
                            }
                            $("#sys-roles-jdc").html(role_jdc);
                            $("#sys-roles-not-jdc").html(role_not_jdc);
                        }
                    }
                });
            }else {
                layer.msg(obj.msg)
            }
        }
    });
}

function sys_role_jdc_del(role_id,jurisdiction_text,role_name) {
    $.ajax({
        type: 'post',
        url: '/sys/role_mg',
        data: {
            "action": 'jdcdel',
            "id": role_id,
            "jurisdiction_text":jurisdiction_text
        },
        dataType: 'json',
        success: function (obj) {
            if (obj.code == 1) {
                $.ajax({
                    type: 'post',
                    url: '/sys/role_mg',
                    data: {
                        "action": 'listjdc',
                        "id": role_id
                    },
                    dataType: 'json',
                    success: function (obj) {
                        if (obj.code == 1) {
                            var role_jdc = '';
                            var role_not_jdc = '';
                            for (i = 0; i < obj.role_jdc.length; i++) {
                                role_jdc += '<a class="btn btn-default btn-xs" style="margin-bottom:20px;width: 20%;margin-left:20px" onclick=sys_role_jdc_del("'+role_id+'","'+ obj.role_jdc[i].jurisdiction_text+ '","' + role_name + '")>' + obj.role_jdc[i].jurisdiction_name + '</a>'
                            }
                            for (i = 0; i < obj.role_not_jdc.length; i++) {
                                role_not_jdc += '<a class="btn btn-default btn-xs" style="margin-bottom:20px;width: 20%;margin-left:20px" onclick=sys_role_jdc_add("' + role_id + '","' + obj.role_not_jdc[i].jurisdiction_text + '","' + role_name + '")>' + obj.role_not_jdc[i].jurisdiction_name + '</a>'
                            }
                            $("#sys-roles-jdc").html(role_jdc);
                            $("#sys-roles-not-jdc").html(role_not_jdc);
                        }
                    }
                });
            }else {
                layer.msg(obj.msg)
            }
        }
    });

}
function sys_roles_jdc_show(role_id,role_name) {
    $.ajax({
        type: 'post',
        url: '/sys/role_mg',
        data: {
            "action": 'listjdc',
            "id":role_id
        },
        dataType: 'json',
        success: function (obj) {
            if (obj.code == 1){
                var role_jdc = ''; var role_not_jdc = '';
                for (i = 0; i < obj.role_jdc.length; i++) {
                    role_jdc+='<a class="btn btn-default btn-xs" style="width: 20%;margin-left:20px;margin-bottom:20px" onclick=sys_role_jdc_del("'+role_id+'","'+ obj.role_jdc[i].jurisdiction_text+ '","' + role_name + '")>'+ obj.role_jdc[i].jurisdiction_name +'</a>'
                }
                for (i = 0; i < obj.role_not_jdc.length; i++) {
                    role_not_jdc+='<a class="btn btn-default btn-xs" style="width: 20%;margin-left:20px;margin-bottom:20px" onclick=sys_role_jdc_add("'+role_id+'","'+ obj.role_not_jdc[i].jurisdiction_text+ '","'+role_name+'")>'+ obj.role_not_jdc[i].jurisdiction_name +'</a>'
                }
                $("#sys-roles-jdc").html(role_jdc);
                $("#sys-roles-not-jdc").html(role_not_jdc);

                layer.open({
                    type: 1,
                    title: "角色["+role_name+"]权限维护",
                    closeBtn: 0,
                    area: ['60%', '390px'],
                    skin: 'white',
                    shadeClose: true,
                    content: $('#sys-role-jdc')
                });

            }
        }
    });
}

function sys_roles_add_show() {
    layer.open({
        type: 1,
        title: "添加角色",
        closeBtn: 0,
        area: ['60%', '250px'],
        skin: 'white',
        shadeClose: true,
        content: $('#sys-roles-add')
    });
}


function sys_roles_edit_show(id,role_name,role_text) {
    document.getElementById("sys-role-text-add").value = role_text;
    document.getElementById("sys-role-name-add").value = role_name;

    $("#sys-role-buttn").html('<a href="#" class="btn btn-default btn-xs" style="float:right" onclick=sys_roles_edit_post("'+ id +'")><i class="fa fa-fw fa-save"></i>确定</a>');

    layer.open({
        type: 1,
        title: "编辑角色",
        closeBtn: 0,
        area: ['60%', '250px'],
        skin: 'white',
        shadeClose: true,
        content: $('#sys-roles-add')
    });
}

function sys_roles_edit_post(id) {
    var role_text = document.getElementById("sys-role-text-add").value;
    var role_name = document.getElementById("sys-role-name-add").value;
    if (role_text == "") {
        layer.msg("请输入角色标签!")
    } else if (role_name == "") {
        layer.msg("请输入角色名称!")
    } else {
        $.ajax({
            type: 'post',
            url: '/sys/role_mg',
            data: {
                "action": 'edit',
                "role_text": role_text,
                "role_name": role_name,
                "id":id
            },
            dataType: 'json',
            success: function (js) {
                var obj = js;
                if (obj.code == 1) {
                    layer.close(layer.index);
                    sys_roles_list_show();
                } else {
                    layer.msg(js.msg)
                }
            }
        });
    }
}

function sys_user_add_post() {
    var user_email = document.getElementById("sys-user-email-add").value;
    var user_name = document.getElementById("sys-user-name-add").value;
    var user_role = document.getElementById("sys-user-role-add").value;
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (user_email == ""){
        layer.msg("用户邮箱不能为空!")
    }else if(!myreg.test(user_email)){
        layer.msg("邮箱地址不合法!")
    }else if (user_name == ""){
        layer.msg("用户名不能为空!")
    }else if(user_role == ""){
        layer.msg("请选择用户角色!")
    }else {
        $.ajax({
            type: 'post',
            url: '/sys/users_mg',
            data: {
                "action": 'add',
                "user_email": user_email,
                "user_name": user_name,
                "user_role":user_role
            },
            dataType: 'json',
            success: function (js) {
                var obj = js;
                if (obj.code == 1) {
                    layer.close(layer.index);
                    sys_user_list_show();
                } else {
                    layer.msg(js.msg)
                }
            }
        });
    }
}
function sys_roles_add_post() {
    var role_text = document.getElementById("sys-role-text-add").value;
    var role_name = document.getElementById("sys-role-name-add").value;

    if (role_text == "") {
        layer.msg("请输入角色标签!")
    } else if (role_name == "") {
        layer.msg("请输入角色名称!")
    } else {
        $.ajax({
            type: 'post',
            url: '/sys/role_mg',
            data: {
                "action": 'add',
                "role_text": role_text,
                "role_name": role_name
            },
            dataType: 'json',
            success: function (js) {
                var obj = js;
                if (obj.code == 1) {
                    layer.close(layer.index);
                    sys_roles_list_show();
                } else {
                    layer.msg(js.msg)
                }
            }
        });
    }
}

function sys_roles_del_post(id) {
    layer.msg('确定删除该角色?', {
        time: 0 //不自动关闭
        , btn: ['确定', '取消']
        , yes: function (index) {
            layer.close(index);
            $.ajax({
                type: 'post',
                url: '/sys/role_mg',
                data: {
                    "action": 'del',
                    "id": id
                },
                dataType: 'json',
                success: function (js) {
                    var obj = js;
                    if (obj.code != 1) {
                        layer.msg(obj.msg)
                    } else {
                        sys_roles_list_show();
                    }
                }
            });
            layer.close(index);
        }
    });

}


//删除用户
function sys_user_del_post(user_id) {
    layer.msg('你确定删除该用户?', {
        time: 0 //不自动关闭
        , btn: ['确定', '取消']
        , yes: function (index) {
            layer.close(index);
            $.ajax({
                type: 'post',
                url: '/sys/users_mg',
                data: {
                    id: user_id,
                    action: 'del'
                },
                dataType: 'json',
                success: function (data) {
                    if (data.code == 1) {
                        sys_user_list_show();
                    } else {
                        layer.msg(data.msg)
                    }
                }
            });
        }
    });
}

function sys_user_add_show() {
    $.ajax({
        type: 'post',
        url: '/sys/role_mg',
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
                    trStr += '<option value="'+obj.data[i].id +'">'+obj.data[i].role_name+'</option>';
                }
                $("#sys-user-role-add").append(trStr);
            }
        }
    });

    layer.open({
        type: 1,
        title: "添加用户",
        closeBtn: 0,
        area: ['60%', '309px'],
        skin: 'white',
        shadeClose: true,
        content: $('#sys-user-add')
    });
}


function sys_jdc_list_show() {  //显示所有角色
    $.ajax({
        type: 'post',
        url: '/sys/jurisdiction_mg',
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
                    trStr += '<td><p style="font-weight:bold">' + obj.data[i].jurisdiction_name + '</p></td> ';
                    trStr += '<td> ' + obj.data[i].jurisdiction_text + '</td>';
                    trStr += '<td> ' + obj.data[i].add_time + '</td>';
                    trStr += '<td> ' + obj.data[i].describe + '</td>';
                    trStr += '<td> <a class="btn btn-default btn-xs" onclick=sys_jdc_del_post("'+ obj.data[i].id +'")><i class="fa fa-fw fa-bitbucket-square"></i>删除</a> ' +
                        '<a class="btn btn-default btn-xs" onclick=sys_jdc_edit_show("' + obj.data[i].id + '","'+ obj.data[i].jurisdiction_name +'","'+ obj.data[i].jurisdiction_text +'","'+ obj.data[i].describe +'")><i class="fa fa-fw fa-edit"></i>编辑</a> ' +
                        //'<a class="btn btn-default btn-xs" onclick=show_project_info("' + obj.data[i].id + '")><i class="fa fa-fw fa-bars"></i>详情</a> ' +
                        '</td>';
                    trStr += '</tr> ';
                }
                $("#sys-jdc-list").html(trStr);
            }
        }
    });
}


function sys_jdc_edit_show(id,jurisdiction_name,jurisdiction_text,describe) {
    document.getElementById("jurisdiction_text").value = jurisdiction_text;
    document.getElementById("jurisdiction_name").value = jurisdiction_name;
    document.getElementById("describe").value = describe;

    $("#sys-jdc-buttn").html('<a href="#" class="btn btn-default btn-xs" style="float:right" onclick=sys_jdc_edit_post("'+ id +'")><i class="fa fa-fw fa-save"></i>确定</a>');

    layer.open({
        type: 1,
        title: "编辑权限信息",
        closeBtn: 0,
        area: ['60%', '309px'],
        skin: 'white',
        shadeClose: true,
        content: $('#sys-jdc')
    });
}

function sys_jdc_edit_post(id) {
    var jurisdiction_text = document.getElementById("jurisdiction_text").value;
    var jurisdiction_name = document.getElementById("jurisdiction_name").value;
    var describe = document.getElementById("describe").value;

    if (jurisdiction_name == "") {
        layer.msg("请输入权限名称!")
    } else if (jurisdiction_text == "") {
        layer.msg("请输入权限标签!")
    } else {
        $.ajax({
            type: 'post',
            url: '/sys/jurisdiction_mg',
            data: {
                "action": 'edit',
                "id":id,
                "describe": describe,
                "jurisdiction_text": jurisdiction_text,
                "jurisdiction_name":jurisdiction_name
            },
            dataType: 'json',
            success: function (js) {
                var obj = js;
                if (obj.code == 1) {
                    layer.close(layer.index);
                    sys_jdc_list_show();
                } else {
                    layer.msg(js.msg)
                }
            }
        });
    }
}

function sys_jdc_add_show() {
    layer.open({
        type: 1,
        title: "添加权限信息",
        closeBtn: 0,
        area: ['60%', '309px'],
        skin: 'white',
        shadeClose: true,
        content: $('#sys-jdc')
    });
}

function sys_jdc_add_post() {
    var jurisdiction_text = document.getElementById("jurisdiction_text").value;
    var jurisdiction_name = document.getElementById("jurisdiction_name").value;
    var describe = document.getElementById("describe").value;

    if (jurisdiction_name == "") {
        layer.msg("请输入权限名称!")
    } else if (jurisdiction_text == "") {
        layer.msg("请输入权限标签!")
    } else {
        $.ajax({
            type: 'post',
            url: '/sys/jurisdiction_mg',
            data: {
                "action": 'add',
                "describe": describe,
                "jurisdiction_text": jurisdiction_text,
                "jurisdiction_name":jurisdiction_name
            },
            dataType: 'json',
            success: function (js) {
                var obj = js;
                if (obj.code == 1) {
                    layer.close(layer.index);
                    sys_jdc_list_show();
                } else {
                    layer.msg(js.msg)
                }
            }
        });
    }
}

function sys_jdc_del_post(id) {
    layer.msg('确定删除该权限信息?', {
        time: 0 //不自动关闭
        , btn: ['确定', '取消']
        , yes: function (index) {
            layer.close(index);
            $.ajax({
                type: 'post',
                url: '/sys/jurisdiction_mg',
                data: {
                    "action": 'del',
                    "id": id
                },
                dataType: 'json',
                success: function (js) {
                    var obj = js;
                    if (obj.code != 1) {
                        layer.msg(obj.msg)
                    } else {
                        sys_jdc_list_show();
                    }
                }
            });
            layer.close(index);
        }
    });

}


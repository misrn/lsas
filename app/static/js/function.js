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


function user_repasswd(id) {
    $("#user-repasswd-buttn").html('<a href="#" class="btn btn-default btn-xs" style="float:right" onclick=user_repasswd_post("' + id + '")><i class="fa fa-fw fa-save"></i>修改</a>');
    layer.open({
        type: 1,
        title: "修改密码",
        closeBtn: 0,
        area: ['60%', '309px'],
        skin: 'white',
        shadeClose: true,
        content: $('#user-repasswd-div')
    });
}

function user_repasswd_post(id) {
    var original_passwd = document.getElementById("original-passwd").value;
    var new_passwd = document.getElementById("new-passwd").value;
    var confirm_passwd = document.getElementById("confirm-passwd").value;
    layer.msg('确定修改密码?', {
        time: 0 //不自动关闭
        , btn: ['确定', '取消']
        , yes: function (index) {
            layer.close(index);
            if (original_passwd == "") {
                layer.msg("原始密码不能为空!")
            } else if (new_passwd == "") {
                layer.msg("新密码不能为空!")
            } else if (confirm_passwd == "") {
                layer.msg("确认密码不能为空!")
            } else if (confirm_passwd.length < 8) {
                layer.msg("密码长度不能少于8位字符!")
            } else if (confirm_passwd != new_passwd) {
                layer.msg("两次密码输入不一致!")
            } else {
                $.ajax({
                    type: 'post',
                    url: '/sys/repasswd',
                    data: {
                        "original_passwd":original_passwd,
                        "new_passwd": new_passwd,
                        "id": id
                    },
                    dataType: 'json',
                    success: function (js) {
                        var obj = js;
                        if (obj.code != 1) {
                            layer.msg(obj.msg)
                        } else {
                            layer.close(layer.index);
                            layer.msg("密码修改成功!")
                        }
                    }
                });
            }
        }
    });
}
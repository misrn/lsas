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

function indexd() {

        $.ajax({
            type: 'post',
            url: '/index_data',
            dataType: 'json',
            success: function (js) {
                var obj = js;
                if (obj.code == 1) {
                    $("#i_assets").html('<span class="info-box-text">固定资产/主机数量</span> <span class="info-box-number">'+ obj.hostzc+' 正常</span> <span class="info-box-number"> <a style="font-weight:bold;color:red;">'+ obj.hostlc+' 异常</a></span>');
                    $("#i_deploy").html('<span class="info-box-text">代码发布</span><span class="info-box-number">项目数： '+ obj.projectac+'</span><span class="info-box-number">日发布次数： '+obj.deployc+'</span>');
                    $("#i_salt").html('<span class="info-box-text">Salt管理</span><span class="info-box-number">文件改动数：'+obj.saltmc+' </span><span class="info-box-number">模块执行：'+obj.cmdc+'</span>');
                    $("#i_user").html('<span class="info-box-text">系统管理/用户管理</span><span class="info-box-number">用户数：'+ obj.userac +'</span> <span class="info-box-number">禁用用户：'+ obj.useryc+'</span>');
                    saltlistdir(dpath)
                } else {
                    layer.msg(obj.msg)
                }
            }
        });
}
/**
 * Created by simonezhou on 2016/5/7.
 */

var $ = require('jquery');

Password = {
    init: function () {
        $('#password_form').submit(function (e) {
            e.defaultPrevented = false;

            var submit = true;

            // 基础表单验证
            if (!validator.checkAll($(this))) {
                submit = false;
            }

            if (submit) {
                var old_password = $('input[name=old_password]').val();
                var new_password = $('input[name=new_password]').val();
                var passwordData = {
                    'old_password': old_password,
                    'new_password': new_password
                }

                $.post('../../cakephp/user/updatePassword', passwordData, function (data) {
                    var ret = eval('(' + data + ')');

                    if (!ret['code']){
                        window.location.href = '../../../html/login.html';
                    } else {
                        alert(ret['info']);
                    }
                })
            }

            return false;
        })
    }
};

$(document).ready(function () {
    Password.init();
});
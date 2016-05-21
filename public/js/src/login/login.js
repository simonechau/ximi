/**
 * Created by simone on 2016/4/16.
 */
var $ = require('jquery');

$(function () {
    $('form').on('blur', 'input[required]', validator.checkField);

    $('#login_form').submit(function(e) {
        e.preventDefault(); //阻止表单提交
        var submit = true;

        // 基础表单验证
        if (!validator.checkAll($(this))) {
            submit = false;
        }

        if (submit) {
            //用户名密码认证
            var name = $('#login_name').val();
            var password = $('#login_password').val();
            var loginData = {name: name, password: password};

            $.post ('../../cakephp/login/login', loginData, function (data) {
                var ret = eval('(' + data + ')');

                if (ret['code'] == 1) {
                    window.location.href = 'index.html';
                } else {
                    alert(ret['info']);
                }
            });
        }

        return false;
    });

    $('#register_form').submit(function(e) {
        e.preventDefault();

        var submit = true;

        if (!validator.checkAll($(this))) {
            submit = false;
        }

        if (submit) {
            var name = $('#register_name').val();
            var password = $('#register_password').val();
            var email = $('#register_email').val();
            var personal = $('#register_personal').val();
            var registerData = {name: name, password: password, email: email, personal: personal};

            $.post ('../../cakephp/login/register', registerData, function(data) {
                var ret = eval('(' + data + ')');
                console.log(data);
                if (ret['code'] == 1) {
                    $('#login-tabb').trigger('click');
                    alert(ret['info']);
                } else {
                    alert(ret['info']);
                }
            });
        }

        return false;
    });
})
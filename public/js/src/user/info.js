/**
 * Created by simonezhou on 2016/5/7.
 */
var $ = require('jquery');

Info = {
    init: function () {
        $.post('../../cakephp/user/getInfo', function (data) {
            var ret = eval('(' + data + ')');
            var info = ret['data'];

            $('input[name=name]').val(info['name']);
            $('input[name=email]').val(info['email']);
            $('input[name=personal]').val(info['personal']);
        });

        $('#info_form').submit(function (e) {
            e.defaultPrevented = false;
            var submit = true;

            // 基础表单验证
            if (!validator.checkAll($(this))) {
                submit = false;
            }

            if (submit) {
                var name = $('input[name=name]').val();
                var email = $('input[name=email]').val();
                var personal = $('input[name=personal]').val();
                var infoData = {
                    'name': name,
                    'email': email,
                    'personal': personal
                }
                
                $.post('../../cakephp/user/updateInfo', infoData, function (data) {
                    var ret = eval('(' + data + ')');
                    if (!ret['code']) {
                        window.location.href = '../../../html/login.html';
                    } else {
                        alert(ret['info']);
                    }
                })
            }

            return false;
        });
    }
};

$(document).ready(function () {
    Info.init();
});
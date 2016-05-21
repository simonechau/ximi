/**
 * Created by simonezhou on 2016/5/3.
 */
var authorize = {
    isAuthorized: function() {
        $.post('../../cakephp/base/isAuthorized', function(data) {
            var ret = eval('(' + data + ')');

            if (!ret['code']) {
                window.location.href = '../html/login.html';
            } else {
                $('#user_name').text(ret['user_name']);
            }
        });
        setTimeout(authorize.isAuthorized, 1800000);
    },

    init: function () {
        //退出操作
        $('.container').on('click', '#logout', function() {
            $.post('../../cakephp/base/logout', null, function (data) {
                var ret = eval('(' + data + ')');
                if (!ret['code']) {
                    window.location.href = '../html/login.html';
                }
            });
        });

        //每次打开页面自动验证session
        setTimeout(authorize.isAuthorized(), 1800000);
    }
}

authorize.init();
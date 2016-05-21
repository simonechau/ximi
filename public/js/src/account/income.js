/**
 * Created by simonezhou on 2016/5/6.
 */

var $ = require('jquery');

var accountList;   //table data
var incomeTable;  //table
var incomeEditor; //table editor
var incomeEditorItem;  //table editor first item
var incomeEditorMember;     //table editor member
var incomeEditorMethod;     //table editor method

Income = {
    init: function () {
        //初始化表单时间控件
        $('input[name=date]').datetimepicker({
            weekStart: 0,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0,
            showMeridian: 1,
            format: 'yyyy-mm-dd',
            language:  'zh-CN',
            pickerPosition: 'bottom-left'
        });

        //初始化生成支出列表数据
        $.post ('../../cakephp/account/getAccountData?page=income', function (data) {
            var ret = eval('(' + data + ')');

            if (!ret['code']) {
                window.location.href = '../../../html/login.html';
            } else {
                //初始化支出表单列表
                var formList = ret['data']['formList'];
                for (var key in formList) {
                    var selectHTML = '';
                    for (var name in formList[key]) {
                        selectHTML += '<option value=' + formList[key][name] + '>' + name + '</option>';
                    }
                    $('select[name=' + key + ']').append(selectHTML);
                }

                //初始化editor select
                var edit = ret['data']['edit'];
                incomeEditorMember = edit['member'];
                incomeEditorMethod = edit['method'];
                incomeEditorItem = edit['item'];

                //初始化支出数据列表
                Income.showIncomeData();
            }
        });

        //增加表单提交
        $('#income_form').submit(function (e) {
            e.preventDefault();

            var submit = true;

            // 基础表单验证
            if (!validator.checkAll($(this))) {
                submit = false;
            }

            if (submit) {
                var sum = $('input[name=sum]').val();
                var item = $('select[name=item]').val();
                var described = $('input[name=described]').val();
                var method = $('select[name=method]').val();
                var member = $('select[name=member]').val();
                var date = $('input[name=date]').val();
                var accountData = {
                    sum: sum,
                    item: item,
                    described: described,
                    method: method,
                    member: member,
                    date: date
                }

                $.post('../../cakephp/account/saveAccount?page=income', accountData, function(data) {
                    var ret = eval('(' + data + ')');

                    accountList = ret['data'];
                    incomeTable.destroy();
                    Income.showIncomeData();
                })
            }

            return false;
        });
    },

    showIncomeData: function () {
        incomeEditor = new $.fn.dataTable.Editor( {
            ajax: "../../cakephp/account/editorAccountData?page=income",
            table: "#income_data",
            type: 'POST',
            fields: [{
                label: "编号",
                name: "account_id",
                type: 'hidden'
            }, {
                label: "描述",
                name: "described"
            }, {
                label: "日期",
                name: "date",
                type: 'date'
            }, {
                label: "分类",
                name: "item_name",
                type: 'select',
                options: incomeEditorItem
            }, {
                label: "账号",
                name: "method_name",
                type: 'select',
                options: incomeEditorMethod
            }, {
                label: "成员",
                name: "member_name",
                type: 'select',
                options: incomeEditorMember
            },{
                label: "金额",
                name: "sum"
            }],
            i18n: {
                edit: {
                    button: '编辑',
                    title: '编辑支出',
                    submit: '确定'
                },
                remove: {
                    button: '删除',
                    title: '删除',
                    submit: '确定',
                    confirm: {
                        _: "确定删除 %d 条支出信息?",
                        1: "确定删除 1 条支出信息?"
                    }
                }
            }
        } );

        incomeTable = $('#income_data').DataTable({
            dom: "Bfrtip",
            ajax: "../../cakephp/account/editorAccountData?page=income",
            columns: [
                { data: "date" },
                { data: "described" },
                { data: "item_name" },
                { data: "method_name" },
                { data: "member_name" },
                { data: "sum"}
            ],
            buttons: [
                { extend: "edit",   editor: incomeEditor },
                { extend: "remove", editor: incomeEditor }
            ],
            fixedHeader: true,
            select: true,
            language: {
                url: '../js/lib/datatables/json/chinese.json'
            }
        });
    }
};

$(document).ready(function () {
    Income.init();
});
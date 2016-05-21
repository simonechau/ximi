/**
 * Created by simonezhou on 2016/4/28.
 */

var $ = require('jquery');

var expenseTable;  //table
var expenseEditor; //table editor
var expenseEditorFirstItem;  //table editor first item
var expenseEditorSecondItem; //table editor second item
var expenseEditorSeller;     //table editor seller
var expenseEditorMember;     //table editor member
var expenseEditorMethod;     //table editor method

Expense = {
    init: function() {
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
        $.post ('../../cakephp/account/getAccountData?page=expense', function (data) {
            var ret = eval('(' + data + ')');

            if (!ret['code']) {
                window.location.href = '../../../html/login.html';
            } else {
                //初始化支出表单列表
                var formList = ret['data']['formList'];

                for (var key in formList) {
                    var selectHTML = '';

                    switch(key) {
                        case 'item' : {
                            for (var primary in formList[key]) {
                                selectHTML += '<optgroup label="' + primary + '">';
                                for (var secondary in formList[key][primary]) {
                                    selectHTML += '<option value=' + formList[key][primary][secondary] + '>' + secondary + '</option>';
                                }
                            }
                            selectHTML += '</optgroup>';
                            break;
                        }
                        default : {
                            for (var name in formList[key]) {
                                selectHTML += '<option value=' + formList[key][name] + '>' + name + '</option>';
                            }
                        }
                    }

                    $('select[name='+ key + ']').append(selectHTML);
                }

                //初始化editor select
                var edit = ret['data']['edit'];

                expenseEditorSeller = edit['seller'];
                expenseEditorMember = edit['member'];
                expenseEditorMethod = edit['method'];
                expenseEditorFirstItem = edit['item']['first_level'];
                expenseEditorSecondItem = edit['item']['second_level'];

                Expense.showExpenseData();
            }
        });

        //增加表单提交
        $('#expense_form').submit(function (e) {
            e.preventDefault();
            var submit = true;

            // 基础表单验证
            if (!validator.checkAll($(this))) {
                submit = false;
            }

            if (submit) {
                var described = $('input[name=described]').val();
                var quantity = $('input[name=quantity]').val();
                var unit_price = $('input[name=unit_price]').val();
                var item = $('select[name=item]').val();
                var method = $('select[name=method]').val();
                var member = $('select[name=member]').val();
                var seller = $('select[name=seller]').val();
                var date = $('input[name=date]').val();
                var accountData = {
                    described: described,
                    quantity: quantity,
                    unit_price: unit_price,
                    item: item,
                    method: method,
                    member: member,
                    seller: seller,
                    date: date
                }

                $.post('../../cakephp/account/saveAccount?page=expense', accountData, function(data) {
                    var ret = eval('(' + data + ')');

                    expenseTable.destroy();
                    Expense.showExpenseData();
                })
            }

            return false;
        });
    },
    
    showExpenseData: function () {
        expenseEditor = new $.fn.dataTable.Editor( {
            ajax: "../../cakephp/account/editorAccountData?page=expense",
            table: "#expense_data",
            type: 'POST',
            fields: [{
                    label: "编号",
                    name: "account_id",
                    type: 'hidden'
                }, {
                    label: "日期",
                    name: "date",
                    type: 'date'
                }, {
                    label: "描述",
                    name: "described"
                }, {
                    label: "一级分类",
                    name: "item_name_1",
                    type: 'select',
                    options: expenseEditorFirstItem
                }, {
                    label: "二级分类",
                    name: "item_name_2",
                    type: 'select'
                }, {
                    label: "商家",
                    name: "seller_name",
                    type: 'select',
                    options: expenseEditorSeller
                }, {
                    label: "支付方式",
                    name: "method_name",
                    type: 'select',
                    options: expenseEditorMethod
                }, {
                    label: "成员",
                    name: "member_name",
                    type: 'select',
                    options: expenseEditorMember
                },{
                    label: "单价",
                    name: "unit_price"
                }, {
                    label: "数量",
                    name: "quantity"
                }
            ],
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

        expenseTable = $('#expense_data').DataTable({
            dom: "Bfrtip",
            ajax: "../../cakephp/account/editorAccountData?page=expense",
            columns: [
                { data: "date" },
                { data: "described" },
                { data: "item_name_2" },
                { data: "seller_name" },
                { data: "method_name" },
                { data: "member_name" },
                { data: "unit_price" },
                { data: "quantity" },
                { data: null, render: function(data) {
                    return data.unit_price * data.quantity;
                } }
            ],
            buttons: [
                { extend: "edit",   editor: expenseEditor },
                { extend: "remove", editor: expenseEditor }
            ],
            fixedHeader: true,
            select: true,
            language: {
                url: '../js/lib/datatables/json/chinese.json'
            }
        });

        $('select', expenseEditor.field('item_name_1').node()).on('change', function () {
            var val = expenseEditor.val('item_name_1');
            expenseEditor.field('item_name_2').update(expenseEditorSecondItem[val]);
        })
    }
};

$(document).ready(function () {
    Expense.init();
});
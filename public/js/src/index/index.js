/**
 * Created by simone on 2016/4/26.
 */

var $ = require('jquery');

require('./authorize');

Index = {
    init: function () {
        $.post('../../cakephp/index/getIndexData', function (data) {
            var ret = eval('(' + data + ')');

            if (!ret['code']) {
                window.location.href = '../../../html/login.html';
            } else {
                $('.yesterday_expense').text(ret['data']['yesterdayExpense']);
                $('.yesterday_income').text(ret['data']['yesterdayIncome']);
                $('.today_expense').text(ret['data']['todayExpense']);
                $('.today_income').text(ret['data']['todayIncome']);

                Index.showTrendTenChart(ret['data']['tenDaysTime'], ret['data']['tenDaysExpense'], ret['data']['tenDaysIncome']);
                Index.showTableData(ret['data']['tenDaysTime'], ret['data']['tenDaysExpense'], 'expense');
                Index.showTableData(ret['data']['tenDaysTime'], ret['data']['tenDaysIncome'], 'income');
            }
        });
    },
    
    showTrendTenChart: function (time, expense, income) {
        $('#trend_ten').highcharts({
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            title: {
                text: null,
                x: -20 //center
            },
            subtitle: {
                text: null,
                x: -20
            },
            xAxis: {
                categories: time
            },
            yAxis: {
                title: {
                    text: null
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '元'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: '收入',
                data: expense
            }, {
                name: '支出',
                data: income
            }]
        });
    },
    
    showTableData: function (dateTime, data, classify) {
        for (var i = 1; i <= 10; ++i) {
            var dataHtml = '<tr>' + '<th scope="row">' + i + '</th>';
            dataHtml += '<td>' + dateTime[i - 1] + '</td>';
            dataHtml += '<td>' + data[i - 1] + '</td>';
            dataHtml += '</tr>';

            $('#' + classify + '_data').append(dataHtml);
        }
    }
};

$(document).ready(function () {
    Index.init();
});
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by simone on 2016/4/26.
	 */

	var $ = __webpack_require__(1);

	__webpack_require__(2);

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

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ }
/******/ ]);
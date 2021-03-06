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
/***/ function(module, exports) {

	/**
	 * Created by simonezhou on 2016/5/9.
	 */

	Compare = {
	    init: function () {
	        $.post('../../cakephp/report/getCompareChart', function (data) {
	            var ret = eval('(' + data + ')');

	            if (!ret['code']) {
	                window.location.href = '../../../html/login.html';
	            } else {
	                //趋势图
	                var trendData = ret['data'];
	                Compare.showTrendChart(trendData['expense_data'], trendData['income_data']);

	                //正负图
	                var conditionData = ret['data'];
	                for (var i = 0; i < 12; ++i) {
	                    conditionData['expense_data'][i] = -conditionData['expense_data'][i];
	                }
	                Compare.showConditionChart(conditionData['expense_data'], conditionData['income_data']);
	            }

	        });
	    },
	    
	    showTrendChart: function (expense_data, income_data) {
	        $('#trend_chart').highcharts({
	            credits: {
	                enabled: false
	            },
	            exporting: {
	                enabled: false
	            },
	            title: {
	                text: null
	            },
	            xAxis: {
	                categories: ['1月', '2月', '3月', '4月', '5月', '6月','7月', '8月', '9月', '10月', '11月', '12月'],
	                labels: {
	                    align: 'right',
	                    style: {
	                        fontSize: '13px',
	                        fontFamily: 'Microsoft Yahei'
	                    }
	                }
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
	            legend: {
	                layout: 'vertical',
	                align: 'right',
	                verticalAlign: 'middle',
	                borderWidth: 0
	            },
	            series: [{
	                name: '支出',
	                data: expense_data
	            }, {
	                name: '收入',
	                data: income_data
	            }]
	        });
	    },

	    showConditionChart: function (expense_data, income_data) {
	        var categories = [  '1月', '2月', '3月', '4月', '5月', '6月',
	                            '7月', '8月', '9月', '10月', '11月', '12月'   ];

	        $('#condition_chart').highcharts({
	            credits: {
	                enabled: false
	            },
	            exporting: {
	                enabled: false
	            },
	            chart: {
	                type: 'bar'
	            },
	            title: {
	                text: null
	            },
	            xAxis: [{
	                categories: categories,
	                reversed: false,
	                labels: {
	                    align: 'right',
	                    style: {
	                        fontSize: '13px',
	                        fontFamily: 'Microsoft Yahei'
	                    }
	                }
	            }, { // mirror axis on right side
	                opposite: true,
	                reversed: false,
	                categories: categories,
	                linkedTo: 0,
	                labels: {
	                    align: 'left',
	                    style: {
	                        fontSize: '13px',
	                        fontFamily: 'Microsoft Yahei'
	                    }
	                }
	            }],
	            yAxis: {
	                title: {
	                    text: null
	                }
	            },
	            plotOptions: {
	                series: {
	                    stacking: 'normal'
	                }
	            },
	            tooltip: {
	                formatter: function(){
	                    return '<b>'+ this.series.name +','+ this.point.category +'</b><br/>'+
	                        '总计: '+ Highcharts.numberFormat(Math.abs(this.point.y), 0);
	                }
	            },
	            series: [{
	                name: '支出',
	                data: expense_data
	            }, {
	                name: '收入',
	                data: income_data
	            }]
	        });

	    }
	};

	$(document).ready(function () {
	    Compare.init();
	});

/***/ }
/******/ ]);
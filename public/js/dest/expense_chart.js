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
	 * Created by simonezhou on 2016/5/9.
	 */

	var $ = __webpack_require__(1);

	var firstItem;
	var firstItemId;
	var secondItem;
	var method;
	var seller;
	var member;

	ExpenseChart = {
	    init: function () {
	        ExpenseChart.setTime('first_item_date');
	        ExpenseChart.setTime('second_item_date');
	        ExpenseChart.setTime('member_date');
	        ExpenseChart.setTime('method_date');
	        ExpenseChart.setTime('seller_date');

	        $('#first_item_date').on('apply.daterangepicker', function(ev, picker) {
	            var startDate = picker.startDate.format('YYYY-MM-DD');
	            var endDate = picker.endDate.format('YYYY-MM-DD');
	            var timeData = {'startDate': startDate, 'endDate': endDate, 'classifyId': 1};

	            $.post('../../cakephp/report/showFirstItemChart', timeData, function (data) {
	                var ret = eval('(' + data + ')');

	                if (!ret['code']) {
	                    window.location.href = '../../../html/login.html';
	                } else {
	                    firstItem['data'] = ret['data']['data'];
	                    firstItem['name'] = ret['data']['name'];
	                    firstItem['id'] = ret['data']['id'];

	                    ExpenseChart.showFirstItemChart();
	                }

	            })
	        });

	        $('#second_item_date').on('apply.daterangepicker', function(ev, picker) {
	            var startDate = picker.startDate.format('YYYY-MM-DD');
	            var endDate = picker.endDate.format('YYYY-MM-DD');
	            var timeData = {'startDate': startDate, 'endDate': endDate, 'firstItemId': firstItemId, 'classifyId': 1};

	            $.post('../../cakephp/report/showSecondItemChart', timeData, function (data) {
	                var ret = eval('(' + data + ')');

	                if (!ret['code']) {
	                    window.location.href = '../../../html/login.html';
	                } else {
	                    secondItem = ret['data'];
	                    ExpenseChart.showSecondItemChart();
	                }

	            })
	        });

	        $('#member_date').on('apply.daterangepicker', function(ev, picker) {
	            var startDate = picker.startDate.format('YYYY-MM-DD');
	            var endDate = picker.endDate.format('YYYY-MM-DD');
	            var timeData = {'startDate': startDate, 'endDate': endDate, 'classifyId': 1};

	            $.post('../../cakephp/report/showMemberChart', timeData, function (data) {
	                var ret = eval('(' + data + ')');

	                if (!ret['code']) {
	                    window.location.href = '../../../html/login.html';
	                } else {
	                    member = ret['data'];
	                    ExpenseChart.showMemberChart();
	                }

	            })
	        });

	        $('#method_date').on('apply.daterangepicker', function(ev, picker) {
	            var startDate = picker.startDate.format('YYYY-MM-DD');
	            var endDate = picker.endDate.format('YYYY-MM-DD');
	            var timeData = {'startDate': startDate, 'endDate': endDate, 'classifyId': 1};

	            $.post('../../cakephp/report/showMethodChart', timeData, function (data) {
	                var ret = eval('(' + data + ')');

	                if (!ret['code']) {
	                    window.location.href = '../../../html/login.html';
	                } else {
	                    method['data'] = ret['data']['data'];
	                    method['name'] = ret['data']['name'];
	                    ExpenseChart.showMethodChart();
	                }

	            })
	        });

	        $('#seller_date').on('apply.daterangepicker', function(ev, picker) {
	            var startDate = picker.startDate.format('YYYY-MM-DD');
	            var endDate = picker.endDate.format('YYYY-MM-DD');
	            var timeData = {'startDate': startDate, 'endDate': endDate, 'classifyId': 1};

	            $.post('../../cakephp/report/showSellerChart', timeData, function (data) {
	                var ret = eval('(' + data + ')');

	                if (!ret['code']) {
	                    window.location.href = '../../../html/login.html';
	                } else {
	                    seller['data'] = ret['data']['data'];
	                    seller['name'] = ret['data']['name'];
	                    ExpenseChart.showSellerChart();
	                }

	            })
	        });

	        ExpenseChart.setInitChart();
	    },
	    
	    setTime: function (id) {
	        var cb = function (start, end) {
	            $('#' + id + ' span').html(start.format('YYYY-M-D') + ' - ' + end.format('YYYY-M-D'));
	        }

	        var optionSet1 = {
	            startDate: moment().startOf('month'),
	            endDate: moment(),
	            maxDate: moment(),
	            dateLimit: {
	                days: 60
	            },
	            showDropdowns: true,
	            timePicker: false,
	            timePickerIncrement: 1,
	            timePicker12Hour: true,
	            ranges: {
	                '今天': [moment(), moment()],
	                '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	                '本月': [moment().startOf('month'), moment().endOf('month')],
	                '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
	            },
	            opens: 'left',
	            buttonClasses: ['btn btn-default'],
	            applyClass: 'btn-small btn-primary',
	            cancelClass: 'btn-small',
	            format: 'YYYY-MM-DD',
	            separator: ' to ',
	            locale: {
	                applyLabel: '提交',
	                cancelLabel: '清除',
	                fromLabel: '从',
	                toLabel: '至',
	                customRangeLabel: '自定义',
	                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
	                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
	                firstDay: 1
	            }
	        };

	        $('#' + id + ' span').html(moment().startOf('month').format('YYYY-MM-DD') + ' - ' + moment().format('YYYY-MM-DD'));

	        $('#' + id).daterangepicker(optionSet1, cb);
	    },

	    setInitChart: function () {
	        var startDate = $('#first_item_date').data('daterangepicker').startDate.format('YYYY-MM-DD');
	        var endDate = $('#first_item_date').data('daterangepicker').endDate.format('YYYY-MM-DD');
	        var timeData = {'startDate': startDate, 'endDate': endDate};

	        $.post('../../cakephp/report/getExpenseChart', timeData, function(data) {
	            var ret = eval('(' + data + ')');

	            if (!ret['code']) {
	                window.location.href = '../../../html/login.html';
	            } else {
	                firstItem = ret['data']['firstItem'];
	                firstItemId = ret['data']['firstItemId'];
	                secondItem = ret['data']['secondItem'];
	                seller = ret['data']['seller'];
	                member = ret['data']['member'];
	                method = ret['data']['method'];

	                ExpenseChart.showFirstItemChart();
	                ExpenseChart.showSecondItemChart();
	                ExpenseChart.showMemberChart();
	                ExpenseChart.showSellerChart();
	                ExpenseChart.showMethodChart();
	            }

	        });
	    },

	    changeFirstItemId: function (category) {
	        var arrNum = $.inArray(category, firstItem['name']);
	        firstItemId = firstItem['id'][arrNum];

	        var startDate = $('#second_item_date').data('daterangepicker').startDate.format('YYYY-MM-DD');
	        var endDate = $('#second_item_date').data('daterangepicker').endDate.format('YYYY-MM-DD');
	        var timeData = {'startDate': startDate, 'endDate': endDate, 'firstItemId': firstItemId, 'classifyId': 1};

	        $.post('../../cakephp/report/showSecondItemChart', timeData, function (data) {
	            var ret = eval('(' + data + ')');

	            if (!ret['code']) {
	                window.location.href = '../../../html/login.html';
	            } else {
	                secondItem = ret['data'];
	                ExpenseChart.showSecondItemChart();
	            }

	        })
	    },
	    
	    showFirstItemChart: function () {
	        $('#first_item_chart').highcharts({
	            credits: {
	                enabled: false
	            },
	            exporting: {
	                enabled: false
	            },
	            chart: {
	                type: 'column',
	                margin: [ 50, 50, 100, 80]
	            },
	            title: {
	                text: null
	            },
	            xAxis: {
	                categories: firstItem['name'],
	                labels: {
	                    rotation: -45,
	                    align: 'right',
	                    style: {
	                        fontSize: '13px',
	                        fontFamily: 'Microsoft Yahei'
	                    }
	                }
	            },
	            plotOptions: {
	                series: {
	                    color: '#29C795',
	                    point: {
	                        events: {
	                            click: function () {
	                                ExpenseChart.changeFirstItemId(this.category);
	                            }
	                        }
	                    }
	                }
	            },
	            yAxis: {
	                min: 0,
	                title: {
	                    text: null
	                }
	            },
	            legend: {
	                enabled: false
	            },
	            tooltip: {
	                pointFormat: '共计: <b>{point.y:.1f} 元</b>',
	            },
	            series: [{
	                data: firstItem['data'],
	                dataLabels: {
	                    enabled: true,
	                    rotation: -90,
	                    color: '#FFFFFF',
	                    align: 'right',
	                    x: 4,
	                    y: 10,
	                    style: {
	                        fontSize: '13px',
	                        fontFamily: 'Microsoft Yahei',
	                        textShadow: false,
	                        fontWeight: 'normal'
	                    }
	                }
	            }]
	        });
	    },

	    showSecondItemChart: function () {
	        $('#second_item_chart').highcharts({
	            credits: {
	                enabled: false
	            },
	            exporting: {
	                enabled: false
	            },
	            chart: {
	                renderTo: 'container',
	                type: 'pie'
	            },
	            title :{
	                text: null
	            },
	            tooltip: {
	                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	            },
	            plotOptions: {
	                pie: {
	                    startAngle: -90,
	                    endAngle: 90,
	                    dataLabels: {
	                        enabled: false
	                    },
	                    center: ['50%', '70%']
	                }
	            },
	            series: [{
	                name: '占比',
	                data: secondItem
	            }]
	        });
	    },

	    showMemberChart: function () {
	        $('#member_chart').highcharts({
	            credits: {
	                enabled: false
	            },
	            exporting: {
	                enabled: false
	            },
	            chart: {
	                plotBackgroundColor: null,
	                plotBorderWidth: null,
	                plotShadow: false
	            },
	            title: {
	                text: null
	            },
	            tooltip: {
	                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	            },
	            plotOptions: {
	                pie: {
	                    allowPointSelect: true,
	                    cursor: 'pointer',
	                    dataLabels: {
	                        enabled: false
	                    },
	                    showInLegend: true
	                }
	            },
	            legend: {
	                enabled: false
	            },
	            series: [{
	                type: 'pie',
	                name: '占比',
	                data: member
	            }]
	        });

	    },

	    showSellerChart: function () {
	        $('#seller_chart').highcharts({
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
	            xAxis: {
	                categories: seller['name'],
	                title: {
	                    text: null
	                },
	                labels: {
	                    align: 'right',
	                    style: {
	                        fontSize: '13px',
	                        fontFamily: 'Microsoft Yahei'
	                    }
	                }
	            },
	            yAxis: {
	                min: 0,
	                title: {
	                    text: null,
	                    align: 'high'
	                },
	                labels: {
	                    overflow: 'justify'
	                }
	            },
	            tooltip: {
	                valueSuffix: ' 元'
	            },
	            plotOptions: {
	                bar: {
	                    dataLabels: {
	                        enabled: true
	                    }
	                },
	                series: {
	                    color: '#428bca'
	                }
	            },
	            legend: {
	                enabled: false
	            },
	            credits: {
	                enabled: false
	            },
	            series: [{
	                name: '总价',
	                data: seller['data'],
	                dataLabels: {
	                    enabled: true,
	                    color: '#FFFFFF',
	                    align: 'right',
	                    style: {
	                        fontSize: '13px',
	                        fontFamily: 'Microsoft Yahei',
	                        textShadow: false,
	                        fontWeight: 'normal'
	                    }
	                }
	            }]
	        });
	    },

	    showMethodChart: function () {
	        $('#method_chart').highcharts({
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
	            xAxis: {
	                categories: method['name'],
	                title: {
	                    text: null
	                },
	                labels: {
	                    align: 'right',
	                    style: {
	                        fontSize: '13px',
	                        fontFamily: 'Microsoft Yahei'
	                    }
	                }
	            },
	            yAxis: {
	                min: 0,
	                title: {
	                    text: null,
	                    align: 'high'
	                },
	                labels: {
	                    overflow: 'justify'
	                }
	            },
	            tooltip: {
	                valueSuffix: ' 元'
	            },
	            plotOptions: {
	                bar: {
	                    dataLabels: {
	                        enabled: true
	                    }
	                },
	                series: {
	                    color: '#A94442'
	                }
	            },
	            legend: {
	                enabled: false
	            },
	            credits: {
	                enabled: false
	            },
	            series: [{
	                name: '总价',
	                data: method['data'],
	                dataLabels: {
	                    enabled: true,
	                    color: '#FFFFFF',
	                    align: 'right',
	                    style: {
	                        fontSize: '13px',
	                        fontFamily: 'Microsoft Yahei',
	                        textShadow: false,
	                        fontWeight: 'normal'
	                    }
	                }
	            }]
	        });
	    }
	    
	};

	$(document).ready(function () {
	    ExpenseChart.init();
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ }
/******/ ]);
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
	 * Created by simonezhou on 2016/5/7.
	 */

	var $ = __webpack_require__(1);

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

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ }
/******/ ]);
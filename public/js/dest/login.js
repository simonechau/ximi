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
	 * Created by simone on 2016/4/16.
	 */
	var $ = __webpack_require__(1);

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

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ }
/******/ ]);
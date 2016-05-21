/**
 * Created by simone on 2016/4/18.
 */
var webpack = require('webpack');

module.exports = {
    entry: {
        login: './src/login/login.js',
        index: './src/index/index.js',
        expense: './src/account/expense.js',
        income: './src/account/income.js',
        info: './src/user/info.js',
        password: './src/user/password.js',
        expense_chart: './src/report/expense_chart.js',
        income_chart: './src/report/income_chart.js',
        compare: './src/report/compare.js'
    },
    output: {
        filename: './dest/[name].js'
    },
    externals: {
        jquery: 'jQuery'
    },
    watch: true
}
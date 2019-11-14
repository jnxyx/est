/*
 * @Author: JN
 * @Date:   2018-08-22 22:06:58
 * @Last Modified by:   JN
 * @Last Modified time: 2018-08-23 20:16:33
 */

const path = require('path');
const entry = './src/index.js';

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    entry: {
    	app: entry,
    	vendor: ['pace', 'phaser', 'vue', 'vue-router']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    module: {
        rules: [{
            test: /\.vue$/,
            use: 'vue-loader'
        }, {
            test: /\.js$/,
            use: 'babel-loader',
        }]
    }
};
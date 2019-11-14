/*
* @Author: JN
* @Date:   2018-08-23 17:54:17
* @Last Modified by:   JN
* @Last Modified time: 2018-08-23 18:02:08
*/
import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>'
});
/*
* @Author: JN
* @Date:   2018-08-23 18:02:28
* @Last Modified by:   JN
* @Last Modified time: 2018-08-23 18:04:57
*/
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    // mode: 'history',
    routes: [{
            path: '/about',
            name: 'about',
            component: () =>
                import('@/pages/about')
        },
        {
            path: '/index',
            name: 'index',
            component: () =>
                import('@/pages/index')
        }
    ]
});
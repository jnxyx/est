/*
 * @Author: JN
 * @Date:   2018-09-10 16:23:10
 * @Last Modified by:   JN
 * @Last Modified time: 2018-09-10 19:27:04
 */
import Vue from 'vue'
import Router from 'vue-router'
import Counter from '../pages/counter'
import Index from '../pages/index'
import Logs from '../pages/logs'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/counter',
      name: 'Counter',
      component: Counter
    },
    {
      path: '/logs',
      name: 'Logs',
      component: Logs
    }
  ]
})

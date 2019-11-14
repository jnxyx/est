/*
* @Author: JN
* @Date:   2018-09-10 16:18:26
* @Last Modified by:   JN
* @Last Modified time: 2018-09-10 16:44:53
*/
import Vue from 'vue'
import App from './AppH5'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

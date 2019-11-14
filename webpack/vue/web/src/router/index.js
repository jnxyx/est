import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Butterfly from '@/components/Butterfly'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/butterfly',
      name: 'butterfly',
      component: Butterfly
    }
  ]
})

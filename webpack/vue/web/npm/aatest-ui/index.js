/**
 * @file index.js
 * @Author: JN
 * @Date:   2018-10-25 15:20:14
 * @Last Modified by:   JN
 * @Last Modified time: 2018-10-25 16:11:29
 */

import install from './src/install';

export default function AatestUI(Vue) {
  install(Vue);
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

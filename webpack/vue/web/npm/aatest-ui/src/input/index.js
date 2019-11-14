/**
 * @file index.js
 * @Author: JN
 * @Date:   2018-10-25 15:32:18
 * @Last Modified by:   JN
 * @Last Modified time: 2018-10-25 15:45:35
 */

import AAInput from './src/main';

AAInput.install = function(Vue) {
  Vue.component(AAInput.name, AAInput);
}

export default AAInput

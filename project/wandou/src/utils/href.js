/*
* @Author: JN
* @Date:   2019-04-28 17:56:24
* @Last Modified by:   JN
* @Last Modified time: 2019-04-28 18:11:20
*/

const pageList = require('../conf/pageList.js');
const tools = require('./tools.js');

module.exports = function(pageType, jumpType, options) {
    for( let i in pageList) {
        if (pageType === i) {
            let page = pageList[i];
            wx[jumpType]({
                url: `${ page }?${ tools.obj2Search(options) }`
            });

            return;
        }
    }

    throw new Error(`Page${ pageType }不存在`);
};

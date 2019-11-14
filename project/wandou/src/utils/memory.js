/**
 * 记忆变量
 */

/* eslint-disable */
const tools = require('./tools.js');
const href = require('./href.js');

let memory = {
    data: {},
    init() {
        /* eslint-disable */
        let globalObj = getApp();
        if (globalObj && globalObj.globalData) {
            memory.data = {
                ...globalObj.globalData,
                ...memory.data
            };

            globalObj.globalData = memory.data || {};
        }
        /* eslint-enable */
    },
    getData(key) {
        memory.init();
        if ('string' !== typeof key) {
            throw new Error('参数有误，请传String类型值');
        }
        if (memory.data.hasOwnProperty(key)) {
            return tools.copy(memory.data[key]);
        }
    },
    setData(key, value) {
        if ('string' !== typeof key) {
            throw new Error('参数有误，键名请传String类型值');
        }
        memory.data[key] = tools.copy(value);
        memory.init();
        return value;
    },
    removeData(key) {
        memory.init();
        if ('string' !== typeof key) {
            throw new Error('参数有误，键名请传String类型值');
        }
        if (memory.data.hasOwnProperty(key)) {
            delete memory.data[key];
        }
    },
    // 检查用户身份
    login() {
        href('LOGIN', 'navigateTo');
    },
    logout() {
        wx.removeStorageSync('userInfo');
        href('HOME', 'reLaunch');
    }
};

module.exports = memory;

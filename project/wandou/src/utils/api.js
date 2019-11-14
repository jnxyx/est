/**
 *  api封装
 */

const env = require('../env.js');
const memory = require('./memory.js');
const tools = require('./tools.js');
const apiConf = require('../conf/apiList.js');
const common = require('../conf/common.js');
const domainConf = require('../conf/domain.js');
const error = require('../conf/error.js');

let handle = {
    checkWifi() {
        return new Promise((resolve, reject) => {
            wx.getNetworkType({
                success: res => {
                    if (res.networkType === 'none') {
                        reject({
                            networkDown: true
                        });
                    }
                    else {
                        resolve(res.networkType);
                    }
                },
                fail: err => {
                    reject({
                        networkDown: true
                    });
                }
            });
        });
    },
    rq(url, data) {
        // 用户信息
        let userInfo = wx.getStorageSync('userInfo') || {};

        // 系统信息
        let systemInfo = memory.getData('systemInfo') || {};
        // 链接参数
        let query = memory.getData('query') || {};

        return new Promise((resolve, reject) => {

            let requestArgs = {
                url: url,
                data: {
                    // 当前系统信息
                    ...systemInfo,
                    // 公参
                    ...common,
                    // 链接参数
                    ...query,
                    // 用户信息
                    ...userInfo,
                    // 数据
                    ...data
                },
                header: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                dataType: 'json',
                success(res) {
                    let result = handle.resolveResponseData(res.data);
                    if (result.errno === 0) {
                        resolve(result.data);
                    }
                    else if (result.errno === 1) {
                        /* eslint-disable */
                        wx.setStorageSync('userInfo', {});
                        /* eslint-enable */
                        memory.login();
                    }
                    else {
                        let err = Object.assign({}, res);
                        reject(err);
                    }
                },
                fail(err) {
                    err = Object.assign({}, err, error.API_ERROR);
                    reject(err);
                }
            };
            requestArgs.data = handle.resolveRequestData(requestArgs.data);
            requestArgs.header = handle.resolveRequestHeader(requestArgs.header);

            wx.request(requestArgs);
        });
    },
    // 处理请求头
    resolveRequestHeader(header) {
        return header;
    },
    // 处理请求数据
    resolveRequestData(data) {
        return data;
    },
    // 处理响应数据
    resolveResponseData(data) {
        return data;
    }
};

let api = {};
for (let domain in apiList) {
    let apis = apiList[domain];
    api[domain] = {};

    for (let iapi in apis) {
        let url = domainConf[env][domain.toLocaleLowerCase()] + apis[iapi];
        api[domain][iapi] = function (data, noLogin) {
            if (noLogin) {
                return handle.checkWifi()
                    .then(() => handle.rq(url, data));
            }

            if (!tools.isLogin()) {
                return memory.login();
            }

            return handle.checkWifi()
                .then(() => handle.rq(url, data));
        };
    }
}
module.exports = api;


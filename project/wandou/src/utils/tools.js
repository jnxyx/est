/**
 * 工具类
 */

// 基础
let baseTool = {
    isArray(arg) {
        if (!arg) {
            return false;
        }

        return arg.constructor === Array;
    },
    isObject(arg) {
        if (!arg) {
            return false;
        }

        return arg.constructor === Object;
    },
    copy(object) {
        if (!baseTool.isObject(object) && !baseTool.isArray(object)) {
            return object;
        }

        return JSON.parse(JSON.stringify(object));
    },
    merge(...args) {
        return baseTool.copy(Object.assign.apply({}, args));
    },
    getItem(key, value, array) {
        if (!baseTool.isArray(array)) {
            throw new Error('参数有误，请传Array类型值');
        }

        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            if (item[key] === value) {
                return baseTool.copy(item);
                break;
            }
        }

        return '';
    },
    money(
        money = 0,
        type = '',
        decimals = 2,
        decimalPoint = '.',
        separator = ','
    ) {
        money = +money;

        if (isNaN(money) || money === 0) {
            // 非 “数字” 或 0 返回 "0.00"
            return '0.00';
        }

        money = '' + (money / 100).toFixed(decimals); // 转化 decimals 位数的小数
        let [integerPart, decimalPart] = money.split('.');
        let reg = /(\d+)(\d{3})/;

        while (reg.test(integerPart)) {
            // 循环添加千位分隔符
            integerPart = integerPart.replace(reg, `$1${separator}$2`);
        }

        if (/^0+$/.test(decimalPart)) {
            // 整数
            money = integerPart;
        }
        else {
            money = `${integerPart}${decimalPoint}${decimalPart}`; // 小数
        }

        switch (type) {
            case 'cn':
                money = `${money}元`; // 标题和其他描述性文案使用 “元”
                break;
            case 'en':
                money = `¥${money}`; // 金额独立展示时使用 “￥”
                break;
            default:
                money = `${money}`; // 默认无修饰符
                break;
        }

        return money;
    },
    datetime(timestamp = 0, format = 'yyyy/mm/dd') {
        timestamp = 1000 * timestamp; // 转化为毫秒
        format = format.toLowerCase();

        if (isNaN(timestamp)) {
            // 非 “数字” 转化为 0
            timestamp = 0;
        }

        let date = new Date(timestamp);
        let map = {
            'm+': date.getMonth() + 1, // 月
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 时
            'i+': date.getMinutes(), // 分
            's+': date.getSeconds() // 秒
        };
        let datetime = format;

        if (/(y+)/.test(datetime)) {
            datetime = datetime.replace(
                RegExp.$1,
                ('' + date.getFullYear()).substring(4 - RegExp.$1.length)
            );
        }

        for (let key in map) {
            if (new RegExp('(' + key + ')').test(datetime)) {
                datetime = datetime.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1 ? map[key] : ('00' + map[key]).substring(('' + map[key]).length)
                );
            }
        }

        return datetime;
    },
    search2Obj(search) {
        let searchStr = search || '';
        if (searchStr) {
            searchStr = searchStr.slice(1, searchStr.length);
            let optionArray = searchStr.split('&');
            let resObj = {};
            for (let i = optionArray.length - 1; i >= 0; i--) {
                let item = optionArray[i].split('=');
                resObj[item[0]] = item[1];
            }
            return resObj;
        }
        return {};
    },
    obj2Search(obj) {
        let search = [];
        Object.keys(obj).forEach(item => {
            search.push(`${item}=${obj[item]}`);
        });
        return search.join('&');
    }
};

// 环境
let envTool = {
    isLogin: () => {
        let userInfo = wx.getStorageSync('userInfo');
        return userInfo && userInfo.STOKEN;
    }
};


module.exports = Object.assign({}, baseTool, envTool);

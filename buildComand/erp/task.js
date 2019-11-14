var customer_source = require('./build/customer_source.js')
var project = require('./build/project.js')
var system_parameter = require('./build/system_parameter.js')

var root = []

/*
	unit      :  菜单名
	cnName    :  中文解释
 */
function setUnit(unit, cnName) {
    for (var i = root.length - 1; i >= 0; i--) {
        var item = root[i]
        if (unit == item.name) {
            item.cnName = cnName
            return;
        }
    }
    var unit = {
        name: unit,
        cnName: cnName,
        pages: [],
    }
    root.push(unit)
}

/*
	unit      :  菜单名
	pageName  ： 文件名
	cnName    :  中文解释
 */
function setPage(unit, pageName, cnName) {
    for (var i = root.length - 1; i >= 0; i--) {
        var item = root[i]
        if (unit == item.name) {
            var page = {
                pageName: pageName,
                cnName: cnName,
                unit: unit,
                url: unit + '/' + pageName
            }
            item.pages = item.pages || []
            item.pages.push(page)
            return;
        }
    }
    var unit = {
        name: unit,
        cnName: '',
        pages: [{
            pageName: pageName,
            cnName: cnName,
            unit: unit,
            url: unit + '/' + pageName
        }],
    }
    root.push(unit)

}

setUnit('system_parameter', '系统参数')
setUnit('customer_source', '客户管理')
setUnit('project', '项目管理')
customer_source(setPage)
project(setPage)
system_parameter(setPage)

module.exports = root
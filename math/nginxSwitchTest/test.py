#!/usr/bin/python
# -*- coding: UTF-8 -*-

'''
【nginx服务器流量切换验证脚本】

注：流量验证规则在rules.json中配置

-- 安装依赖 --
请求插件：sudo easy_install requests ( https://pypi.org/project/requests/ )
--json插件：sudo easy_install demjson
'''

import requests
import json
import sys

exports = ''

arglen = len(sys.argv)
fileName = 'rules' if arglen == 1 else sys.argv[1]

# 获取验证规则
def getRules():
	with open(fileName + '.json') as json_file:
		rules = json.load(json_file)
		return rules

# 验证规则
def verifyRule(response, resultRule):
	code = str(response.status_code)
	body = str(response.text.encode("utf-8"))
	location = str(response.headers.get('location', default = ''))
	defaultBody = '叮叮鲜食欢迎您！温馨提示：服务器在00:00~04:00期间进行升级，请04:00之后再来吧~'
	# print resultRule
	for rule in resultRule:
		# rule = resultRule[i]
		if(code != rule['code']):
			continue
		if(rule['respones'] != '' and body == rule['respones'].encode("utf-8")):
			return rule['type']
		elif(location == '' and rule['location'] == '' and body != defaultBody):
			return rule['type']
		elif(location != '' and rule['location'] != '' and body != defaultBody):
			return rule['type']
	return 'unknown'

# 拼接验证信息
def renderExports(rules, exports):
	for i in range(len(rules)):
		rule = rules[i]
		exports += '==============================================================================================' + '\n'
		exports += '验证系统：【' + rule['title'].encode("utf-8") + '】\n'
		urls = rule['url']
		resultRule = rule['result']
		for j in range(len(urls)):
			url = urls[j]
			response = requests.get(url, allow_redirects=False)
			code = str(response.status_code)
			body = str(response.text.encode("utf-8"))[0:100] + '...'
			# body = '******' if len(body) > 100 else body
			location = str(response.headers.get('location', default = ''))
			exports += '----------------------------------------------------------------------------------------------' + '\n'
			exports += '测试链接：' + url.encode("utf-8") + '\n'
			exports += '返回状态码：' + code + '\n'
			exports += '返回内容：' + body + '\n'
			exports += '重定向链接：' + location + '\n'
			exports += '验证结果：【' + verifyRule(response, resultRule).encode("utf-8") + '】\n'
			exports += '----------------------------------------------------------------------------------------------' + '\n'
		exports += '==============================================================================================' + '\n'
		exports += '\n'
		exports += '\n'
		exports += '\n'
		exports += '\n'
		exports += '\n'
		exports += '\n'
	return exports

rules = getRules()
exports = renderExports(rules, exports)

print exports

# 将验证结果写入报告
with open(fileName + '-report' + '.txt', 'w') as result_file:
	result_file.write(exports)


#!/usr/bin/python
# -*- coding: UTF-8 -*-

# 图片批量上传至新cdn脚本
# created by xuyunxiang On 20180611
import os,sys
# path='/Users/user/documents/my/my/node-test/folder/image'
path='/export/App/api.shop/image'
def paths(path):
    path_collection=[]
    for dirpath,dirnames,filenames in os.walk(path):
            for file in filenames:
                    fullpath=os.path.join(dirpath,file)
                    path_collection.append(fullpath)
    return path_collection
for file in paths(path):
	fileParts = file.split('/')
	fileName = fileParts[len(fileParts) - 1]
	fileName = fileName.replace('__', '/')
	command = 'curl -T '
	command += file + ' '
	command += 'http://upload.dingdingfresh.com:8002/image/'
	command += fileName

	# print fileName
	print command
	os.system(command)
	# 'curl -T /Users/user/documents/my/my/node-test/folder/image/image__dingding__b__checkbox-checked.png http://upload.dingdingfresh.com:8002/image/upload1.png'
	# 访问：http://image.dingdingfresh.com:8002/upload1.png
	# print file

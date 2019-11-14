#!/bin/bash

# @Author: JN
# @Date:   2018-08-29 21:42:30
# @Last Modified by:   JN
# @Last Modified time: 2018-08-29 21:47:36

# BCLOUD参数
ARGV=$1

if [ $ARGV = prod ]
then
   LOANBRANCH='master'
else
   LOANBRANCH='dev-3.0'
fi
echo $LOANBRANCH
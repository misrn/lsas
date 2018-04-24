#!/bin/bash 
set -e  
PROJECT=$1 
LINENUM=$2 
LOGFILE="/data/logs/${PROJECT}.log"  #更改为自己日志路径
if [ ! -f $LOGFILE ];then
    echo "日志文件:${LOGFILE},不存在!"
elif [ $LINENUM ];then
    sed -n "${LINENUM},$"p $LOGFILE
else
    wc -l $LOGFILE|awk '{print $1}'
fi

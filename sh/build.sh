#! /bin/bash
# $1  projectDir          项目目录
# $2  buildScript         打包命令
# $3  npmRegistry         npm镜像源      

cd $1

npm install --production --npmRegistry=${3} && npm run $2
#! /bin/bash
# $1  tmpdir              临时目录
# $2  name                项目名
# $3  target              远程仓库地址
# $4  branch              分支
# $5  build               打包命令

cd $1

git clone $3 $2

cd $2

git fetch origin $4 

git checkout $4

npm install --production && npm run $5
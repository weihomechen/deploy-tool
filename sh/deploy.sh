#! /bin/bash
# $1 name       项目名
# $2 target     项目目录
# $3 branch     git分支
# $4 web        目标服务器
# $5 dir        服务器目录
# $6 user       服务器用户
# $7 password   服务器密码
# $8 type       项目类型


cd $2

git checkout $3

cnpm install --production

dname=$(dirname "$0")

if [ $8 == 'static' ]
then
  export NODE_ENV=production && npm run build
  rm -rf $1.tar.gz
  tar -czf $1.tar.gz build
  expect $dname/upload.sh $1 $4 $5 $6 $7
  expect $dname/static.sh $1 $4 $5 $6 $7
elif [ $8 == 'node' ]
then
  cd ../
  tar -czf $1.tar.gz $1
  expect $dname/upload.sh $1 $4 $5 $6 $7
  expect $dname/execute.sh $1 $4 $5 $6 $7
fi

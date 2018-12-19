#! /bin/bash
# $1 name                 项目名
# $2 target               项目目录
# $3 branch               git分支
# $4 web                  目标服务器
# $5 dir                  服务器目录
# $6 user                 服务器用户
# $7 password             服务器密码
# $8 type                 项目类型
# $9 build                打包命令
# ${10} dist              打包后的文件夹
# ${11} repertoryType     仓库类型
# ${12} isNeedBuild         是否已打包
# ${13} tmpdir            临时目录

if [ ${11} == 'remote' ]
then 
  cd ${13}
elif [ ${11} == 'local' ]
then 
  cd $2
fi

if [ "${11}" == 'remote' ]
then 
  git clone $2 ${1}
  cd ${1}
fi

git checkout $3

if [ "${12}" == 'true' ]
then 
  cnpm install --production
  export NODE_ENV=production && npm run $9
fi

dname=$(dirname "$0")

if [ $8 == 'static' ]
then
  rm -rf $1.tar.gz
  tar -czf $1.tar.gz ${10}
  expect $dname/upload.sh $1 $4 $5 $6 $7
  rm -rf $1.tar.gz
  expect $dname/static.sh $1 $4 $5 $6 $7 ${10}
elif [ $8 == 'node' ]
then
  cd ../
  rm -rf $1.tar.gz
  tar -czf $1.tar.gz $1
  expect $dname/upload.sh $1 $4 $5 $6 $7
  rm -rf $1.tar.gz
  expect $dname/execute.sh $1 $4 $5 $6 $7
fi

#! /bin/bash
# $1 name               项目名
# $2 target             项目目录
# $3 branch             git分支
# $4 web                目标服务器
# $5 dir                服务器目录
# $6 user               服务器用户
# $7 password           服务器密码
# $8 type               项目类型
# $9 build              打包命令
# ${10} dist            打包后的文件夹
# ${11} repertoryType   仓库类型
# ${12} isNeedBuild     是否需要打包
# ${13} tmpdir          临时目录

dname=$(dirname "$0")

read -s -p 'ssh Login Pwd:' pwd

echo

bash $dname/deploy.sh $1 $2 $3 $4 $5 $6 $pwd $8 $9 ${10} ${11} ${12} ${13}
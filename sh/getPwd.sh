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
# ${11} isRepertory     项目路径是否为远程仓库

dname=$(dirname "$0")

read -s -p 'ssh login pwd:' pwd

echo

bash $dname/deploy.sh $1 $2 $3 $4 $5 $6 $pwd $8 $9 ${10}
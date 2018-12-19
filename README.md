## 说明

部署应用工具，支持部署Web项目到服务器

## 功能特性

- ✔︎ 支持本地或远程项目，远程项目需设置仓库地址
- ✔︎ 支持前端或Node项目，Node项目部署后运行
- ✔︎ 支持上传静态资源到OSS服务器
- ✔︎ 支持设置默认的配置，一次配置多次使用，配置可扩展

[English Document](https://github.com/weihomechen/deploy-tool/blob/master/README-en.md)

## 安装

```sh
npm i @ifun/deploy -g
```

## 使用

```sh
# 部署项目
deploy -n <name>

# 示例
deploy -n blog
```

提示输入ssh登录密码，按回车确认

## 单纯上传静态资源到OSS：deploy-oss

支持从本地或仓库上传静态资源到OSS，如果是本地项目，则直接上传到oss服务器指定目录。如果是远程仓库，会先`git clone`到本地，如果需要打包，则执行传入的打包命令，然后再上传。

```sh
# 示例，只单纯上传静态资源到OSS
deploy-oss -n <name> -i <accessKeyId> -s <accessKeySecret>
```

## 参数说明

完整参数： 

```sh
  .option('-n, --name <name>', '必须，项目名称')
  .option('-w, --web [web]', '必须，web服务器')
  .option('-u, --user [user]', '必须，web服务器用户名')
  .option('-d, --dir [dir]', '必须，要部署到web服务器的目录')
  .option('-r, --repertoryType [repertoryType]', '仓库类型：local -- 本地，remote -- 远程仓库，默认local')
  .option('-t, --target [target]', '必须，项目路径，本地项目即为文件路径，远程仓库为仓库地址如git仓库地址')
  .option('-b, --branch [branch]', 'git分支，默认master')
  .option('-e, --type [type]', '项目类型，static -- 前端项目 node -- Node项目，默认static')
  .option('--isNeedBuild [isNeedBuild]', '是否需要打包，false -- 不需要，true -- 需要，默认true')
  .option('--build [build]', "项目打包命令，如果isNeedBuild值为'true'则必传，默认'build'，会执行‘npm run build’")
  .option('--dist [dist]', '存放打包后文件的目录名，默认dist')
  .option('-o, --oss [oss]', '是否将静态资源上传到oss，false -- 不需要，true -- 需要，默认false')
  .option('-i, --accessKeyId [accessKeyId]', 'oss accessKeyId')
  .option('-s, --accessKeySecret [accessKeySecret]', 'oss accessKeySecret')
  .option('--bucket [bucket]', 'oss bucket')
  .option('--region [region]', 'oss region')
  .option('--assets [assets]', 'oss服务器目录，用来存放要上传的静态资源')
  .option('--publicDir [publicDir]', '该项目要上传的静态资源目录')
```

## 自定义默认配置

全局和具体项目的默认配置位于 `config.json` 文件中

### 直接修改config.json实现自定义

- 查找全局安装的npm包：

```
npm list -g --depth 0
```

![](https://rulifun.oss-cn-hangzhou.aliyuncs.com/static/image/WX20181011-135003%402x.png)

- 修改`config.json` 文件即可: 

```
vim /usr/local/lib/node_modules/@ifun/deploy/config.json
```

#### 配置文件说明

```js
{
  "defaultConfig": {                                     // global config
    "web": "118.118.118.118",                            // web server ip address
    "dir": "/var/proj/",                                 // web server dir
    "user": "root",                                      // ssh login user name
    "repertoryType": "local",                            // repertory type, local/remorte
    "branch": "master",                                  // git branch
    "type": "static",                                    // proj type static/node
    "isNeedBuild": "true",                               // is need build, string, false/true
    "build": "build",                                    // if isNeedBuild === 'true', npm run script
    "dist": "build",                                     // proj dir where put builded files
    "oss": "false"                                       // is need upload assets to OSS, string, false/true
  },
  "projConfigMap": {                                      // project config
    "blog": {                                             // project name
      "repertoryType": "remote",                          // repertory type
      "target": "https://github.com/weihomechen/blog.git" // project address
    },
    "blog-node": {
      "target": "/Users/ifun/my-projects/blog-node",
      "type": "node",
      "isNeedBuild": "false"
    },
    "ssr-starter": {
      "repertoryType": "remote",
      "target": "https://github.com/weihomechen/ssr-starter.git",
      "type": "node",
      "oss": "true",
      "publicDir": "build",
      "bucket": "rulifun",
      "region": "oss-cn-hangzhou",
      "assets": "/ssr-starter/client"
    }
  }
}
```


### 命令行

#### 通过命令修改

```sh
# @param all 是否获取所有配置 true-是 false-否 默认：false
deploy-get -a [all] -t [target] -k [key]

# e.g. 获取所有配置项
deploy-get -a true

# e.g. 获取全局的web配置项
deploy-get -k web

# e.g. 获取项目blog的type配置项
deploy-get -t blog -k type

# @param target 全局配置-g 项目配置-项目名(e.g:blog) 默认:g
deploy-set -t [target] -k <key> -v <value>

# e.g. 修改全局的user配置项
deploy-set -k user -v yourname

# e.g. 修改项目配置项
deploy-set -t blog -k type -v node

```

#### 临时修改

临时输入的参数具有最高权级，会覆盖全局和项目的默认配置，仅生效一次

```sh
# 通过命令行传递的`web`的参数最终会被使用
deploy -n blog-node -w 88.88.88.88 
```

## 约定

以下约定是本项目的默认设置，如需更改，请修改配置文件`config.json`

### 前端
- 项目生产环境打包命令 `build`
- 打包后的文件夹名 `build`

### 服务端
- 服务启动命令 `npm run prod`  
- 服务停止命令 `npm run stop`

## 实践

以下项目均通过本工具实现部署，线上预览地址在项目的github page：

- [blog](https://github.com/weihomechen/blog)
- [blog-node](https://github.com/weihomechen/blog-node)
- [react-admin](https://github.com/weihomechen/react-admin)
- [react-admin-node](https://github.com/weihomechen/react-admin-node)
- [vue-mail](https://github.com/weihomechen/vue-mail-front)
- [vue-blog](https://github.com/weihomechen/vue-blog)
- [ssr-starter](https://github.com/weihomechen/ssr-starter)

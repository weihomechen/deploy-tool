## 说明

部署应用工具，目前支持部署本地项目到服务器

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

## 参数说明

完整参数： 

```sh
# 必须
-n, --name <name>, 项目名称

# 可选
-t, --target [target], 项目的本地路径
-w, --web [web], web服务器地址，如118.118.118.118
-d, --dir [dir], 部署到服务器的目录
-b, --branch [branch], git分支，默认`master`
-u, --user [user], web服务器用户名，默认`root`
-e, --type [type], 项目类型，static -- 前端项目 node -- Node项目，默认`static`
--build [build], 项目生产环境打包命令，默认`build`
--dist [dist], 打包后的文件夹名, 默认`build`

-o, --oss [oss], 是否将静态资源上传到oss
-i, --accessKeyId [accessKeyId], oss accessKeyId
-s, --accessKeySecret [accessKeySecret], oss accessKeySecret
--region [region], oss region
--assets [assets], oss 静态资源目录
--publicDir [publicDir], 项目静态资源目录
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
  "defaultConfig": {              // 默认配置 default config
    "web": "118.25.16.129",       // web server
    "dir": "/var/proj/",          // web server target dir
    "branch": "master",           // git branch
    "build": "build",             // build script define by package.json 
    "dist": "build",              // builded filename
    "user": "root",               // web server ssh user
    "type": "static"              // deploy type 静态项目 - static node项目 - node
  },
  "projConfigMap": {              // 具体项目的配置 proj config
    "blog": {                     // 项目名
      "target": "/Users/ifun/my-projects/blog" // 项目在本地的路径
    },
    "blog-node": {
      "target": "/Users/ifun/my-projects/blog-node",
      "type": "node"
    },
    "vue-mail": {
      "target": "/Users/ifun/my-projects/vue-mail-front",
      "build": "build:prod",
      "dist": "dist"
    },
    "react-admin": {
      "target": "/Users/ifun/my-projects/antd-admin",
      "dist": "dist"
    }
  }
}
```

### 命令行

#### 通过命令修改

```sh
# @param target 全局配置-g 项目配置-项目名(e.g:blog) 默认:g
deploy-set -t [target] -k <key> -v <value>

# 修改全局的user配置项
deploy-set -k user -v yourname

# 修改项目配置项
deploy-set -t blog -k type -v node

# @param all 是否获取所有配置 true-是 false-否 默认：false
deploy-get -a [all] -t [target] -k [key]

# 获取所有配置项
deploy-get -a true

# 获取全局的web配置项
deploy-get -k web

# 获取项目blog的type配置项
deploy-get -t blog -k type

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

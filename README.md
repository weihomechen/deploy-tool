## 说明

部署应用工具，部署Web项目到服务器

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

## @2.x

- 重构了大部分代码，模块之间的功能划分更加明确，减少耦合，
  - `bin`作为工具的命令行入口，只负责识别命令、整合参数给具体的执行者
  - `lib`聚焦于单一功能点，完成具体的功能
  - `config`存储配置
  - `sh`放置执行脚本
- 变更配置的使用方式，工具不再维护具体项目的配置，由具体项目自己维护
- 通过命令行只能配置全局参数，不再提供通过命令行配置项目的参数

## 使用

### 部署项目

通过在项目根目录下新建一个名为`deploy.config.js`的文件，导出项目自己的配置:

```js
// deploy.config.js
module.exports = {
  // key即为部署方案名，一个项目可以有多个部署方案，比如部署在多个服务器，或者多个部署模式
  dev: {
    web: '192.168.90.78',
  },
  prod: {
    web: '118.25.16.129',
  }
}
```

使用时，在项目根目录下运行：

```sh
deploy app <scheme>

# 示例
deploy app dev
```

### 获取和设置全局参数

```sh
# 获取全局配置项web
deploy config get web

# 设置全局配置项web为88.88.88.88
deploy config set web 88.88.88.88

```

### 单纯上传到oss

支持从本地或仓库上传静态资源到OSS，如果是本地项目，则直接上传到oss服务器指定目录。如果是远程仓库，会先`git clone`到本地，如果需要打包，则执行传入的打包命令，然后再上传。

```sh
# e.g.
deploy oss <scheme> -i <accessKeyId> -s <accessKeySecret>
```

### 帮助
``` sh
# for help
deploy -h

# for more detail
deploy <command> -h

# e.g
deploy app -h

```

## 参数说明

默认的全局配置：

```js
{
  "web": "118.25.16.129", // 服务器ip地址
  "dir": "/var/proj/", // 服务器部署目录
  "user": "root", // 用于ssh登录的用户名
  "type": "0", // 项目类型，0-static，1-node
  "isNeedBuild": true, // 是否执行打包构建
  "buildScript": "build", // 构建命令
  "distDir": "dist", // 构建后静态资源目录
  "npmRegistry": "http://registry.npmjs.org/" // npm镜像源
}
```

可通过命令行传入的参数： 

```sh
  .command('app <name>')
  .option('-w, --web [web]', 'web服务器')
  .option('-u, --user [user]', 'web服务器用户名')
  .option('-d, --dir [dir]', '要部署到web服务器的目录')

.command('config <action>')
  .option('-a, --all', '是否读取全部配置')

 .command('oss <name>')
  .option('-i, --accessKeyId <accessKeyId>', 'oss accessKeyId')
  .option('-s, --accessKeySecret <accessKeySecret>', 'oss accessKeySecret')
  .option('-p [publicDir]', '项目内要部署到OSS的文件目录')
  .option('-b [bucket]', 'oss bucket')
  .option('-r [region]', 'oss region')
  .option('-a [assets]', 'oss 静态资源目录')
```

## 自定义默认配置

### 通过命令行可以设置全局配置

```sh
deploy config set [key] [value]
# e.g.
deploy config set user yourname
```

### 项目内的配置文件

在项目的根目录下，通过`deploy.config.js`文件，维护项目自己的配置：

```js
// deploy.config.js
module.exports = {
  // key即为部署方案名，一个项目可以有多个部署方案，比如部署在多个服务器，或者多个部署模式
  dev: {
    web: '192.168.90.78',
    newkey: 'new value',
  },
  prod: {
    web: '118.25.16.129',
  }
}
```

### 临时修改

临时输入的参数具有最高权级，会覆盖全局和项目的默认配置，仅生效一次

```sh
# 通过命令行传递的`web`的参数最终会被使用
deploy app [scheme] -w 88.88.88.88 
```


## 约定

以下约定是本项目的默认设置

### 前端
- 项目生产环境打包命令 `build`
- 打包后的文件夹名 `dist`

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

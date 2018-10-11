## 说明

部署应用工具，目前支持部署本地项目到服务器

## 安装

```sh
npm i @ifun/deploy -g
```

## 使用

```sh
# 部署前端项目
deploy -n <name> -p <pwd> 

# 示例
deploy -n blog -p 123456

# 部署node项目
deploy -n <name> -p <pwd>

# 示例
deploy -n blog-node -p 123456

```

## 参数说明

完整参数： 

```sh
# 必须
-n, --name <name>, 项目名称
-p, --password <pwd>, web服务器密码

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

### 通过修改config.js实现自定义(只需改一次)

全局和具体项目的默认配置位于 `config.js` 文件中

- 查找全局安装的npm包：

```
npm list -g --depth 0
```

![](https://rulifun.oss-cn-hangzhou.aliyuncs.com/static/image/WX20181011-135003%402x.png)

- 修改`config.js` 文件即可: 

```
vim /usr/local/lib/node_modules/@ifun/deploy/config.js
```

#### 配置文件说明

```js
// 默认配置 default config
exports.defaultConfig = {
  web: '118.25.16.129', // web server
  dir: '/var/proj/',    // web server target dir
  branch: 'master',     // git branch
  build: 'build',       // build script define by package.json 
  dist: 'build',        // builded filename
  user: 'root',         // web server ssh user
  type: 'static',       // deploy type
};

// 具体项目的配置 proj config
exports.projConfigMap = {
  blog: {
    target: '/Users/weihome/my-projects/blog',
  },
  'blog-node': {
    target: '/Users/weihome/my-projects/blog-node',
    type: 'node',
  },
  'vue-mail': {
    target: '/Users/weihome/my-projects/vue-mail-front',
    build: 'build:prod',
    dist: 'dist',
  }
}
```

### 命令行

通过命令行输入的参数具有最高权级，会覆盖全局和项目的默认配置

```
# 通过命令行传递的`web`的参数最终会被使用
node ./bin/deploy.js -w 88.88.88.88 
```

## 约定

以下约定是本项目的默认设置，如需更改，请修改配置文件`config.js`

### 前端
- 项目生产环境打包命令 `build`
- 打包后的文件夹名 `build`

### 服务端
- 服务启动命令 `npm run prod`  
- 服务停止命令 `npm run stop`

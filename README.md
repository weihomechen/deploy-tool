## 说明

部署应用工具，目前只支持在本地部署项目到服务器

### 参数说明：

完整参数： 

```sh
# 必须
-n, --name <name>, 项目名称
-p, --password <pwd>, web服务器密码

# 可选
-t, --target [target], 项目路径
-w, --web [web], web服务器
-d, --dir [dir], 部署到web服务器的目录
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

### 通过修改config.js实现自定义

全局和具体项目的默认配置位于根目录 `config.js` 文件中

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

## 使用

```sh
# 部署前端项目
node ./bin/deploy.js -n name -t target -b branch -w web -d dir -u user -p pwd -e type

# 示例
node ./bin/deploy.js -n blog -p 123456

# 部署node项目
node ./bin/deploy.js -n name -t target -b branch -w web -d dir -u user -p pwd -e type

# 示例
node ./bin/deploy.js -n blog-node -p 123456

```

## 约定

### 服务端
- 服务启动命令 `npm run prod`  
- 服务停止命令 `npm run stop`  

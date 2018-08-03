### 说明

部署应用工具，目前只支持在本地部署项目到服务器

参数说明：

完整参数： 

```
# 必须
-n, --name <name>, 项目名称
-t, --target <target>, 项目路径
-b, --branch <branch>, git分支
-w, --web <web>, web服务器
-d, --dir <dir>, 部署到web服务器的目录
-u, --user <user>, web服务器用户名
-p, --password <pwd>, web服务器密码
-e, --type <type>, 项目类型，static -- 前端项目 node -- Node项目

# 可选
-o, --oss [oss], 是否将静态资源上传到oss
-i, --accessKeyId [accessKeyId], oss accessKeyId
-s, --accessKeySecret [accessKeySecret], oss accessKeySecret
--region [region], oss region
--assets [assets], oss 静态资源目录
--publicDir [publicDir], 项目静态资源目录
```

### 使用
```sh
# 部署node项目
node ./bin/deploy.js -n name -t target -b branch -w web -d dir -u user -p pwd -e type

# 部署前端项目
node ./bin/deploy.js -n name -t target -b branch -w web -d dir -u user -p pwd -e type
```

### 约定

#### 前端
打包命令:  `npm run build`
打包文件夹名称: `build`

#### 服务端
服务启动命令 `npm run prod`  
服务停止命令 `npm run stop`  

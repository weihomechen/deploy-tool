

/**
  * 完整配置示例：
   name: 项目名称: {
     target: 项目路径
     web: web服务器地址
     dir: 部署到web服务器的目录 
     password: web服务器密码
     branch: git分支，默认`master`
     build: 项目内package.json的打包命令，默认 build，会执行 npm run build
     dist: 打包后的文件夹名称，默认在项目根目录，默认名为 build
     user: web服务器用户名，默认`root`
     type: 项目类型，static -- 前端项目 node -- Node项目，默认`static`
     # 可选
     oss: 是否将静态资源上传到oss
     accessKeyId: oss accessKeyId
     accessKeySecret: oss accessKeySecret
     region: oss region
     assets: oss 静态资源目录
     publicDir: 项目静态资源目录
   }
 */

// 默认配置default config
exports.defaultConfig = {
  web: '118.118.118.118', // web server
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

exports.config = () => {
  return {
    defaultConfig,
    projConfigMap,
  };
}
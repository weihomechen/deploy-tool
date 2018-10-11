#!/usr/bin/env node

const {
  spawn,
} = require('child_process');
const os = require('os');
const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('mkdirp');
const program = require('commander');

const {
  uniqueDirname,
} = require('../lib/util');
const upload = require('../lib/upload');
const {
  defaultConfig,
  projConfigMap,
} = require('../config');

program
  .usage('-n <name> -p <pwd> ')
  .version(require('../package.json').version)
  .option('-n, --name <name>', '项目名称')
  .option('-p, --password <pwd>', 'web服务器密码')
  .option('-t, --target [target]', '项目路径')
  .option('-b, --branch [branch]', 'git分支')
  .option('-w, --web [web]', 'web服务器')
  .option('-d, --dir [dir]', '部署到web服务器的目录')
  .option('--build [build]', '项目打包命令')
  .option('--dist [dist]', '打包后的目录名')
  .option('-u, --user [user]', 'web服务器用户名')
  .option('-o, --oss [oss]', '是否将静态资源上传到oss')
  .option('-i, --accessKeyId [accessKeyId]', 'oss accessKeyId')
  .option('-s, --accessKeySecret [accessKeySecret]', 'oss accessKeySecret')
  .option('--bucket [bucket]', 'oss bucket')
  .option('--region [region]', 'oss region')
  .option('--assets [assets]', 'oss 静态资源目录')
  .option('--publicDir [publicDir]', '项目静态资源目录')
  .option('-e, --type [type]', '项目类型，static -- 前端项目 node -- Node项目')
  .parse(process.argv);

const tmpdir = uniqueDirname(os.tmpdir(), 'deploy-');

const { name, password } = program;
const projConfig = projConfigMap[name];
if (!name || !projConfig || !password) {
  program.help();
}

const config = {
  ...defaultConfig,
  ...projConfig,
  program,
};

const {
  target,
  branch,
  web,
  dir,
  user,
  type,
  build,
  dist,
  // optional
  oss,
  accessKeyId,
  accessKeySecret,
  bucket,
  region,
  assets,
  publicDir,
} = config;

if (oss && !(accessKeyId && accessKeySecret && bucket && region && assets && publicDir)) {
  console.log('使用oss需传入accessKeyId、accessKeySecret等参数');

  program.help();
}

console.log(`tmpdir: %s`, tmpdir);

mkdirp.sync(tmpdir);

const deploy = spawn('bash', [
  path.join(__dirname, '../sh/deploy.sh'),
  name,
  target,
  branch,
  web,
  dir,
  user,
  password,
  type,
  build,
  dist,
]);

deploy.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

deploy.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

deploy.on('close', (code) => {
  if (program.oss) {
    upload({
      accessKeyId,
      accessKeySecret,
      bucket,
      region,
      assets,
    }, tmpdir, program.target.replace('/', '-'), program.publicDir).then(() => {
      console.log(`child process exited with code ${code}`);

      fs.removeSync(tmpdir);
    }).catch((e) => {
      fs.removeSync(tmpdir);

      throw e;
    });
  } else {
    console.log(`child process exited with code ${code}`);

    fs.removeSync(tmpdir);
  }
});

process.on('SIGINT', () => {
  fs.removeSync(tmpdir);

  process.exit(0);
});

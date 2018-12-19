#!/usr/bin/env node

const {
  spawn,
} = require('child_process');
const os = require('os');
const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('mkdirp');
const program = require('commander');
const chalk = require('chalk');

const { log } = console;
const error = chalk.hex('#f33535');
const warning = chalk.keyword('orange');
const info = chalk.cyan;
const success = chalk.green;

const {
  uniqueDirname,
} = require('../lib/util');
const upload = require('../lib/upload');

const data = fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8');

const {
  defaultConfig,
  projConfigMap
} = JSON.parse(data);

program
  .usage('-n <name>')
  .version(require('../package.json').version)
  .option('-n, --name <name>', '项目名称')
  .option('-w, --web [web]', 'web服务器')
  .option('-u, --user [user]', 'web服务器用户名')
  .option('-d, --dir [dir]', '要部署到web服务器的目录')
  .option('-r, --repertoryType [repertoryType]', '仓库类型：local -- 本地，remote -- 远程仓库')
  .option('-t, --target [target]', '项目路径，本地项目即为文件路径，远程仓库为仓库地址如git仓库地址')
  .option('-b, --branch [branch]', 'git分支，默认master')
  .option('-e, --type [type]', '项目类型，static -- 前端项目 node -- Node项目')
  .option('--isNeedBuild [isNeedBuild]', '是否需要打包，false -- 不需要，true -- 需要')
  .option('--build [build]', "项目打包命令，如果isNeedBuild值为'true'则必传，默认'build'，会执行‘npm run build’")
  .option('--dist [dist]', '存放打包后文件的目录名')
  .option('-o, --oss [oss]', '是否将静态资源上传到oss')
  .option('-i, --accessKeyId [accessKeyId]', 'oss accessKeyId')
  .option('-s, --accessKeySecret [accessKeySecret]', 'oss accessKeySecret')
  .option('--bucket [bucket]', 'oss bucket')
  .option('--region [region]', 'oss region')
  .option('--assets [assets]', 'oss服务器目录，用来存放要上传的静态资源')
  .option('--publicDir [publicDir]', '该项目要上传的静态资源目录')
  .parse(process.argv);

const { name } = program;
const projConfig = projConfigMap[name];
if (!name || !projConfig) {
  program.help();
}

const config = {
  ...defaultConfig,
  ...projConfig,
  ...program,
};

const {
  // 目标服务器的基本信息
  web,
  dir,
  user,
  // 仓库的基本信息
  repertoryType,
  target,
  branch,
  // 项目类型
  type,
  // 项目是否打包信息
  isNeedBuild,
  build,
  dist,
  // 上传静态资源到OSS
  oss,
  accessKeyId,
  accessKeySecret,
  bucket,
  region,
  assets,
  publicDir,
} = config;

const paramsValidater = {
  web: {
    msg: '请设置web服务器（希望项目部署到的服务器地址）e.g. deploy-set -k web -v 88.88.88.88',
  },
  dir: {
    msg: '请设置web服务器部署项目的目录，e.g. deploy-set -k dir -v /www/proj/',
  },
  user: {
    msg: '请设置ssh登录服务器的用户名，如root',
  },
  repertoryType: {
    msg: '请设置项目的仓库类型，本地 -- local，远程 -- remote',
  },
  target: {
    msg: '请设置项目路径，本地即为文件路径，远程为仓库地址如git仓库地址',
  },
  branch: {
    msg: '请设置项目分支，如master',
  },
  isNeedBuild: {
    msg: '请设置项目是否需要打包，如需打包必须传入打包命令',
  },
  build: {
    msg: '请设置项目需要打包情况下执行的打包命令，传入build，则执行npm run build',
  },
  dist: {
    msg: '请传入项目存放打包后文件的目录',
  },
}

const paramError = Object.keys(paramsValidater).find(key => config[key] === undefined);

if (paramError) {
  log(error(paramsValidater[paramError].msg));
  log(info('\n查看说明：deploy -h\n'))
  process.exit(1);
}

if (oss === 'true' && !(accessKeyId && accessKeySecret && bucket && region && assets && publicDir)) {
  log(error('\n使用oss需传入accessKeyId、accessKeySecret等参数'));
  log(info('\n查看说明：deploy -h\n'))
  process.exit(1);
}

const tmpdir = uniqueDirname(os.tmpdir(), 'deploy-');
mkdirp.sync(tmpdir);

if (repertoryType === 'remote') {
  log(info('\n本次部署使用的临时目录:', `${tmpdir}\n`));
}

const deploy = spawn('bash', [
  path.join(__dirname, '../sh/getPwd.sh'),
  name,
  target,
  branch,
  web,
  dir,
  user,
  'pwd',
  type,
  build,
  dist,
  repertoryType,
  isNeedBuild,
  tmpdir,
], { stdio: 'inherit', shell: true });

deploy.on('data', (data) => {
  log(info(`stdout: ${data}`));
});

deploy.on('error', (data) => {
  log(error(`stderr: ${data}`));
});

deploy.on('close', (code) => {
  if (oss === 'true') {
    const assetsDirMap = {
      local: `${target}/${publicDir}`,
      remote: `${tmpdir}/${name}/${publicDir}`,
    };

    upload({
      accessKeyId,
      accessKeySecret,
      bucket,
      region,
      assets,
    }, assetsDirMap[repertoryType]).then(() => {
      log(error(`\nchild process exited with error. code: ${code}\n`));

      fs.removeSync(tmpdir);
      log(info(`临时目录 ${tmpdir} 已删除\n`));
    }).catch((e) => {
      log(error(`\nchild process exited with error\n`));
      fs.removeSync(tmpdir);
      log(info(`临时目录 ${tmpdir} 已删除\n`));

      throw e;
    });
  } else {
    log(success(`\nchild process exited with code ${code}\n`));

    fs.removeSync(tmpdir);
    log(info(`临时目录 ${tmpdir} 已删除\n`));
  }
});

process.on('SIGINT', () => {
  fs.removeSync(tmpdir);
  log(info(`临时目录 ${tmpdir} 已删除\n`));

  process.exit(0);
});

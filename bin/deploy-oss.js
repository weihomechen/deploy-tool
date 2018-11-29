#!/usr/bin/env node

const {
  spawn,
} = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const mkdirp = require('mkdirp');
const os = require('os');

const {
  uniqueDirname,
} = require('../lib/util');
const upload = require('../lib/upload');

const data = fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8');
const tmpdir = uniqueDirname(os.tmpdir(), 'deploy-');
mkdirp.sync(tmpdir);

const {
  defaultConfig,
  projConfigMap
} = JSON.parse(data);

program
  .usage('-n <name> ')
  .version(require('../package.json').version)
  .option('-n, --name <name>', '项目名称')
  .option('-i, --accessKeyId <accessKeyId>', 'oss accessKeyId')
  .option('-s, --accessKeySecret <accessKeySecret>', 'oss accessKeySecret')
  .option('-p [publicDir]', '要部署到OSS的文件目录')
  .option('-b [bucket]', 'oss bucket')
  .option('-r [region]', 'oss region')
  .option('-a [assets]', 'oss 静态资源目录')
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
  isRepertory,
  target,
  branch = 'master',
  publicDir,
  accessKeyId,
  accessKeySecret,
  bucket,
  region,
  assets,
  build,
} = config;

if (!(target && build && accessKeyId && accessKeySecret && bucket && region && assets && publicDir)) {
  console.log('使用oss需传入accessKeyId、accessKeySecret等参数');

  program.help();
}

const uploadProcess = (assetsDir) => {
  upload({
    accessKeyId,
    accessKeySecret,
    bucket,
    region,
    assets,
  }, assetsDir).then(() => {
    console.log(`child process exited with success`);

    fs.removeSync(tmpdir);
  }).catch((e) => {
    fs.removeSync(tmpdir);

    throw e;
  });
}

let buildProcess;

if (isRepertory) {
  buildProcess = spawn('bash', [
    path.join(__dirname, '../sh/build.sh'),
    tmpdir,
    name,
    target,
    branch,
    build,
  ], { stdio: 'inherit', shell: true });

  buildProcess.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  buildProcess.on('error', (data) => {
    console.log(`stderr: ${data}`);
  });

  buildProcess.on('close', (code) => {
    if (code === 0) {
      const assetsDir = `${tmpdir}/${name}/${publicDir}`
      uploadProcess(assetsDir);
    } else {
      console.log('something wrong in buildProcess, code:', code);
      fs.removeSync(tmpdir);
    }
  });
} else {
  uploadProcess(publicDir);
}

process.on('SIGINT', () => {
  fs.removeSync(tmpdir);

  process.exit(0);
});

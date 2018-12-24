#!/usr/bin/env node

const {
  spawn,
} = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const mkdirp = require('mkdirp');
const os = require('os');
const chalk = require('chalk');

const { log } = console;
const error = chalk.hex('#f33535');
const info = chalk.cyan;
const success = chalk.green;

const {
  uniqueDirname,
} = require('./util');
const upload = require('./upload');

function deployOSS(options) {
  const data = fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8');
  const {
    defaultConfig,
    projConfigMap
  } = JSON.parse(data);

  const { name } = options;
  const projConfig = projConfigMap[name];

  const config = {
    ...defaultConfig,
    ...projConfig,
    ...options,
  };

  log('-------config------', JSON.stringify(config, null, 2))

  const {
    repertoryType,
    isNeedBuild,
    target,
    branch,
    publicDir,
    accessKeyId,
    accessKeySecret,
    bucket,
    region,
    assets,
    build,
  } = config;

  if (!(target && build && accessKeyId && accessKeySecret && bucket && region && assets && publicDir)) {
    log(error('使用oss需传入accessKeyId、accessKeySecret等参数'));

    process.exit(1);
  }

  const uploadProcess = (assetsDir) => {
    upload({
      accessKeyId,
      accessKeySecret,
      bucket,
      region,
      assets,
    }, assetsDir).then(() => {
      log(success(`child process exited with success`));

      fs.removeSync(tmpdir);
      log(info(`\n临时目录 ${tmpdir} 已删除\n`));
    }).catch((e) => {
      log(error(`\n上传\n`));
      fs.removeSync(tmpdir);
      log(info(`\n临时目录 ${tmpdir} 已删除\n`));

      throw e;
    });
  }

  let handleRepertory;
  const tmpdir = uniqueDirname(os.tmpdir(), 'deploy-');
  mkdirp.sync(tmpdir);
  log(info(`\n本次部署使用的临时目录：${tmpdir}\n`));

  if (repertoryType === 'remote') {
    handleRepertory = spawn('bash', [
      path.join(__dirname, `../sh/${isNeedBuild === 'false' ? 'clone' : 'build'}.sh`),
      tmpdir,
      name,
      target,
      branch,
      build,
    ], { stdio: 'inherit', shell: true });

    handleRepertory.on('data', (data) => {
      log(info(`stdout: ${data}`));
    });

    handleRepertory.on('error', (data) => {
      log(error(`stderr: ${data}`));
    });

    handleRepertory.on('close', (code) => {
      if (code === 0) {
        const assetsDir = `${tmpdir}/${name}/${publicDir}`
        uploadProcess(assetsDir);
      } else {
        log(error('\nsomething wrong in handleRepertory, code:', code));
        fs.removeSync(tmpdir);
        log(info(`\n临时目录 ${tmpdir} 已删除\n`));
      }
    });
  } else {
    uploadProcess(`${target}/${publicDir}`);
  }

  process.on('SIGINT', () => {
    fs.removeSync(tmpdir);
    log(info(`\n临时目录 ${tmpdir} 已删除\n`));

    process.exit(0);
  });

}

module.exports = (options) => deployOSS(options);

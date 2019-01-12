#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const { log } = console;
const error = chalk.hex('#f33535');
const warning = chalk.keyword('orange');
const info = chalk.cyan;

const configFilePath = path.join(__dirname, '../config.json');
const data = fs.readJsonSync(configFilePath, 'utf8');

const {
  defaultConfig,
  projConfigMap
} = data;

if (!defaultConfig) {
  log(error('读取配置文件失败'));
  process.exit(1);
}

function getConfig(options) {
  const {
    all,
    target,
    key,
  } = options;

  if (all || (!key && !target)) {
    log(info('~~~~~~~~~~~ All config start ~~~~~~~~~~~'));
    log(JSON.stringify(data, null, 2));
    log(info('~~~~~~~~~~~ All config end ~~~~~~~~~~~'));
    process.exit(0);
  }

  const isGlobal = target === 'global';

  if (!key) {
    const values = isGlobal ? defaultConfig : projConfigMap[target];

    if (values) {
      log(info(`\n~~~~~~~~~~~ ${target} config start ~~~~~~~~~~~`));
      log(JSON.stringify(values, null, 2));
      log(info(`~~~~~~~~~~~~ ${target} config end ~~~~~~~~~~~~\n`));
    } else {
      log(warning(`\n Project ${target}: no exixt\n`));
    }

    process.exit(0);
  }

  const value = isGlobal ? defaultConfig[key] : projConfigMap[target][key];
  const prefix = isGlobal ? `Global config ${key}` : `Project ${target}'s ${key}`;
  if (value) {
    log(info(`\n${prefix}: ${value}\n`))
  } else {
    log(warning(`\n${prefix}: no exixt\n`));
  }
  process.exit(0);
}

module.exports = (options) => getConfig(options);

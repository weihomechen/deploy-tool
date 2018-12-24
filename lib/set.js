#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const chalk = require('chalk');

const { log } = console;
const error = chalk.hex('#f33535');
const success = chalk.green;

const configFilePath = path.join(__dirname, '../config.json');
const res = fs.readFileSync(configFilePath, 'utf8');
const data = JSON.parse(res);

const {
  defaultConfig,
  projConfigMap
} = data;

if (!defaultConfig) {
  log(error(`Something wrong when try to read config file: ${configFilePath}`));
  process.exit(1);
}

function setConfig(options) {
  const {
    target = 'g',
    key,
    value,
  } = options;

  if (!key || !value) {
    log(error('key and value are required.\n'));
    process.exit(1);
  }

  const isGlobal = target === 'g';
  if (isGlobal) {
    defaultConfig[key] = value;
  } else {
    // 可能是新增
    projConfigMap[target] || (projConfigMap[target] = {})
    projConfigMap[target][key] = value;
  }

  const config = JSON.stringify(data, null, 2);
  fs.writeFileSync(configFilePath, config);

  log(success(`set ${target === 'g' ? 'global' : target} config: ${key} with value: ${value} success.`));
  process.exit(0);
}

module.exports = (options) => setConfig(options);

#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const { log } = console;
const error = chalk.hex('#f33535');
const success = chalk.green;

const configFilePath = path.join(__dirname, '../config.json');
const data = fs.readJsonSync(configFilePath, 'utf8');

const {
  defaultConfig,
  projConfigMap
} = data;

if (!defaultConfig) {
  log(error(`Something wrong when try to read config file: ${configFilePath}`));
  process.exit(1);
}

const setConfig = async (options = {}, configurations = {}) => {
  const {
    type = 'single',
    target = 'g',
    key,
    value,
  } = options;
  const isGlobal = target === 'g';

  if (type === 'single') {
    if (!key || !value) {
      log(error('key and value are required.\n'));
      process.exit(1);
    }

    if (isGlobal) {
      defaultConfig[key] = value;
    } else {
      // 可能是新增
      projConfigMap[target] || (projConfigMap[target] = {})
      projConfigMap[target][key] = value;
    }
  } else if (type === 'multiple') {
    if (isGlobal) {
      data.defaultConfig = {
        ...defaultConfig,
        ...configurations,
      };
    } else {
      const { target } = options;
      data.projConfigMap[target] = configurations;
    }
  }

  const config = JSON.stringify(data, null, 2);
  return new Promise((resolve, reject) => {
    fs.writeFile(configFilePath, config, (error) => {
      if (!error) {
        if (type === 'single') {
          log(success(`set ${target === 'g' ? 'global' : target} config: ${key} with value: ${value} success.`));
        } else if (type === 'multiple') {
          log(success(`set ${target === 'g' ? 'global' : target} configurations success.`));
        }
        resolve();
      } else {
        throw error;
      }
    });
  });
}

module.exports = (options, configurations) => setConfig(options, configurations);

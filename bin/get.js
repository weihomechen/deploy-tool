#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const program = require('commander');

const configFilePath = path.join(__dirname, '../config.json');
const res = fs.readFileSync(configFilePath, 'utf8');
const data = JSON.parse(res);

const {
  defaultConfig,
  projConfigMap
} = data;

if (!defaultConfig) {
  console.log('读取配置文件失败');
  process.exit(1);
}

program
  .usage('-a [all] -t [target] -k [key]')
  .version(require('../package.json').version)
  .option('-a, --all [all]', '是否读取全部配置，是-true，默认false')
  .option('-t, --target [target]', 'g-全局配置 项目名(e.g:blog)-项目配置 默认 g-全局')
  .option('-k, --key [key]', '要读取的配置项，不读取全部时必填 e.g. branch')
  .parse(process.argv);

const { target = 'g', key, all = 'false' } = program;

if (!key && all === 'false') {
  program.help();
}

if (all === 'true') {
  console.log(res);
  process.exit(0);
}

const value = target === 'g' ? defaultConfig[key] : projConfigMap[target][key];
console.log(value || '该配置项不存在');

process.exit(0);

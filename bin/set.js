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
  .usage('-t [target] -k <key> -v <value>')
  .version(require('../package.json').version)
  .option('-t, --target [target]', '全局配置:g 项目配置:项目名(e.g:blog) 默认:g')
  .option('-k, --key <key>', '必须，要设置的配置项 e.g branch')
  .option('-v, --value <value>', '必须，设置配置项的值 e.g master')
  .parse(process.argv);

const { target = 'g', key, value } = program;

if (!key || !value) {
  program.help();
}

if (target === 'g') { // global
  defaultConfig[key] = value;
} else { // proj
  // 可能是新增
  projConfigMap[target] || (projConfigMap[target] = {})
  projConfigMap[target][key] = value;
}

const config = JSON.stringify(data);
fs.writeFileSync(configFilePath, config);

console.log(`set ${target === 'g' ? 'global' : target} config: ${key} with value: ${value} success`);
process.exit(0);

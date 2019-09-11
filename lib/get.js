#!/usr/bin/env node

const path = require('path')
const {
  error,
  info,
  warn,
} = require('./util')

const globalConfigPath = path.join(__dirname, '../config/config.global.json')
const globalConfig = require(globalConfigPath)

if (!globalConfig) {
  error('读取全局配置文件失败')

  process.exit(1)
}

function getConfig(options) {
  const {
    all,
    key,
  } = options

  if (all || !key) {
    info('~~~~~~~~~~~ All global config start ~~~~~~~~~~~')
    console.log(JSON.stringify(globalConfig, null, 2))
    info('~~~~~~~~~~~ All global config end ~~~~~~~~~~~')

    process.exit(0)
  }

  const value = globalConfig[key]
  const prefix = `Global config ${key}`

  if (value) {
    info(`\n${prefix}: ${value}\n`)
  } else {
    warn(`\n${prefix}: no exixt\n`)
  }

  process.exit(0)
}

module.exports = (options) => getConfig(options)

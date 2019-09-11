#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')

const {
  error,
  success,
} = require('./util')

const globalConfigPath = path.join(__dirname, '../config/config.global.json')
let globalConfig = require(globalConfigPath)

if (!globalConfig) {
  error('读取全局配置文件失败')

  process.exit(1)
}

/**
 * 设置配置
 * 保留了以前的老逻辑，现在只能设置全局配置
 * 具体项目的配置由各个项目自己维护，工具不应该维护具体业务逻辑
 * @param {object} options
 * @param {object} configurations
 */
const setConfig = async (options = {}, configurations = {}) => {
  const {
    type = 'single',
    target = 'global',
    key,
    value,
  } = options
  const isGlobal = target === 'global'

  if (type === 'single') {
    if (!key || !value) {
      error('key and value are required.\n')

      process.exit(1)
    }

    if (isGlobal) {
      globalConfig[key] = value
    }
  } else if (type === 'multiple') {
    if (isGlobal) {
      globalConfig = {
        ...globalConfig,
        ...configurations,
      }
    }
  }

  const config = JSON.stringify(globalConfig, null, 2)

  return new Promise((resolve, reject) => {
    fs.writeFile(globalConfigPath, config, (error) => {
      if (!error) {
        if (type === 'single') {
          success(`set ${target} config: ${key} with value: ${value} success.\n`)
        } else if (type === 'multiple') {
          success(`set ${target}'s configurations success.\n`)
        }

        resolve()
      } else {
        throw error
      }
    })
  })
}

module.exports = (options, configurations) => setConfig(options, configurations)

#!/usr/bin/env node

/**
 * 命令行 deploy [action]
 * 工具入口，主要是识别命令、收集、校验、整合配置给具体的执行者
 * @param action: config | [scheme] | oss | version
 * deploy config get/set 读取或设置全局的配置，有个坑就是重新安装npm包后，又会变成默认配置
 * deploy [scheme]: 按照scheme方案部署
 * deploy oss: 单纯上传资源到OSS
 * deploy version: 查看版本号
 */

const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const {
  checkNodeVersion,
  cleanArgs,
  info,
  getPwd,
  getSecret,
  getProjectConfig,
  paramChecker,
} = require('../lib/util')

// 检查node版本
const requiredVersion = require('../package.json').engines.node
checkNodeVersion(requiredVersion, '@ifun/deploy')

// 获取全局配置
const globalConfigPath = path.resolve(__dirname, '../config/config.global.json')

delete require.cache[require.resolve(globalConfigPath)]

const globalConfig = require(globalConfigPath)

// 查看版本号
program
  .version(require('../package').version)
  .usage('<action> [options]')

// 读取或设置全局配置
program
  .command('config <action> [key] [value]')
  .option('-a, --all', '是否读取全部配置')
  .action((action, key, value, cmd) => {
    const tempOptions = cleanArgs(cmd)

    const options = {
      ...tempOptions,
      key,
      value,
    }

    require(`../lib/${action}`)(options)
  })

// 按照部署方案进行部署
program
  .command('app <scheme>')
  .option('-w, --web [web]', 'web服务器')
  .option('-u, --user [user]', 'web服务器用户名')
  .option('-d, --dir [dir]', '要部署到web服务器的目录')
  .action(async (scheme, cmd) => {
    // 只在deploy app | oss 命令下才去获取项目配置
    const projectConfig = getProjectConfig(scheme)
    const tempOptions = cleanArgs(cmd)

    let { pwd } = projectConfig
    pwd || (pwd = await getPwd())

    /**
     * 参数优先级：临时（命令行传入）参数 > 项目配置 > 默认配置
     */
    const options = {
      ...globalConfig,
      ...projectConfig,
      ...tempOptions,
      scheme,
      pwd,
    }

    paramChecker(options)

    require(`../lib/deploy`)(options)
  })

// 单独执行上传资源到OSS
program
  .command('oss <name>')
  .option('-i, --accessKeyId <accessKeyId>', 'oss accessKeyId')
  .option('-s, --accessKeySecret <accessKeySecret>', 'oss accessKeySecret')
  .option('-p [publicDir]', '项目内要部署到OSS服务器的文件目录')
  .option('-b [bucket]', 'oss服务器bucket')
  .option('-r [region]', 'oss服务器region')
  .option('-a [assets]', 'oss服务器上放置静态资源的目录')
  .action(async (scheme, cmd) => {
    // 只在deploy app | oss 命令下才去获取项目配置
    const projectConfig = getProjectConfig(scheme)
    const tempOptions = cleanArgs(cmd)
    const accessKeySecret = await getSecret()

    const options = {
      ...globalConfig,
      ...projectConfig,
      ...tempOptions,
      scheme,
      accessKeySecret,
    }

    paramChecker(options)

    require(`../lib/deploy-oss`)(options)
  })

// add some useful info on help
program.on('--help', () => {
  info(`\n Run ${chalk.cyan(`deploy <command> --help`)} for detailed usage of given command.\n`)
})

program.commands.forEach(c => c.on('--help', () => console.log()))

program.parse(process.argv)

process.on('SIGINT', () => {
  process.exit(0)
})

const fs = require('fs-extra')
const path = require('path')
const semver = require('semver')
const chalk = require('chalk')
const inquirer = require('inquirer')
const { exec } = require('child_process')

const consoleLogConfigPath = path.resolve(__dirname, '../config/config.console.json')
const consoleLog = require(consoleLogConfigPath)

// 打印信息的配置
const { log } = console
const getLogConfig = () => {
  const logger = {}
  const { color } = consoleLog

  Object.keys(color).map(key => {
    logger[key] = (msg, val = '') => log(chalk.hex(color[key])(msg, val))
  })

  return logger
}

const { error, info, success, warn } = getLogConfig()

const uniqueDirname = (dir, prefix) => {
  let rnd = `${(prefix || '')}${parseInt(Math.random() * 10000).toString()}`

  try {
    const files = fs.readdirSync(dir)

    while (files.indexOf(rnd) !== -1) {
      rnd = `${(prefix || '')}${parseInt(Math.random() * 10000).toString()}`
    }
  } catch (e) {
    console.error(e)
  }

  return path.join(dir, rnd)
}

const camelize = (str) => {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
const cleanArgs = (cmd) => {
  const args = {}

  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })

  return args
}

const checkNodeVersion = (wanted, id) => {
  if (!semver.satisfies(process.version, wanted)) {
    console.error(
      `You are using Node ${process.version}, but this version of ${id} requires Node ${wanted}.
      \nPlease upgrade your Node version.\n`
    )

    process.exit(1)
  }
}

const pwdValidator = value => {
  if (!value) {
    return '请输入你的SSH登录密码'
  }

  if (/[\u4e00-\u9fa5]/gm.test(value)) {
    return '你确定你的SSH登录密码里面有中文字符？😱😱😱'
  }

  return true
}

const getPwd = async () => {
  const answers = await inquirer.prompt([{
    type: 'password',
    message: '请输入ssh登录密码',
    name: 'pwd',
    validate: pwdValidator,
  }])

  info('\n✅  密码get✔︎,放心我不告诉别人🤣\n')

  return answers.pwd
}

const getSecret = async () => {
  const answers = await inquirer.prompt([{
    type: 'password',
    message: '请输入OSS服务器的accessKeySecret',
    name: 'accessKeySecret',
  }])

  info('\n✅  get✔︎,放心我不告诉别人🤣\n')

  return answers.accessKeySecret
}

const paramsValidator = {
  web: {
    msg: '请设置web服务器（希望项目部署到的服务器地址）e.g. deploy-set -k web -v 88.88.88.88',
  },
  dir: {
    msg: '请设置web服务器部署项目的目录，e.g. deploy-set -k dir -v /www/proj/',
  },
  user: {
    msg: '请设置ssh登录服务器的用户名，如root',
  },
  isNeedBuild: {
    msg: '请设置项目是否需要打包，如需打包必须传入打包命令',
  },
  buildScript: {
    msg: '请设置项目需要打包情况下执行的打包命令，传入build，则执行npm run build',
  },
  distDir: {
    msg: '请设置项目存放打包后文件的目录',
  },
}

const paramChecker = (config) => {
  // 配置校验
  const paramError = Object.keys(paramsValidator).find(key => config[key] === undefined)

  if (paramError) {
    error(`配置项缺失：${paramsValidator[paramError].msg}`)

    process.exit(1)
  }
}

const shell = (order, option = {}) => {
  return new Promise((resolve, reject) => {
    exec(order, option, (err, stdout) => {
      if (err) {
        reject(err)
      } else {
        resolve(stdout)
      }
    })
  })
}

const getProjectConfig = (scheme) => {
  const projectDir = process.cwd()

  const projectPackageInfoPath = path.resolve(projectDir, './package.json')
  const projectConfigMapPath = path.resolve(projectDir, './deploy.config.js')

  if (!fs.existsSync(projectConfigMapPath)) {
    error('\n❌ 请在项目根目录新建“deploy.config.js”文件，用做该项目部署使用的配置\n')

    process.exit(1)
  }

  delete require.cache[require.resolve(projectPackageInfoPath)]
  delete require.cache[require.resolve(projectConfigMapPath)]

  const projectConfigMap = require(projectConfigMapPath)
  const projectConfig = projectConfigMap[scheme]
  const { name } = require(projectPackageInfoPath)

  if (!name) {
    error('\n❌  name字段缺失，请检查项目package.json文件，确保存在name字段\n')

    process.exit(1)
  }

  if (!projectConfig) {
    error(`\n❌  部署方案${scheme}未配置\n`)

    process.exit(1)
  }

  return {
    ...projectConfig,
    projectDir,
    name,
  }
}

module.exports = {
  cleanArgs,
  checkNodeVersion,
  uniqueDirname,
  error,
  info,
  success,
  warn,
  getPwd,
  getSecret,
  paramChecker,
  shell,
  getProjectConfig,
}

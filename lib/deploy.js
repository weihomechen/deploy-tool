#!/usr/bin/env node

const path = require('path')
const { spawn } = require('child_process')

const {
  error,
  info,
  success,
  shell,
} = require('./util')

const deploy = async options => {
  const {
    // 项目信息
    name,
    projectDir,
    scheme,
    type,
    // 目标服务器的基本信息
    web,
    dir,
    user,
    pwd,
    // 构建打包信息
    isNeedBuild,
    buildScript,
    distDir,
    npmRegistry,
  } = options

  info('\n🚗  🚕  🚙  🚌  🚓  🚑  🚔  ✈️    开始发车   🚗  🚕  🚙  🚌  🚓  🚑  🚔  ✈️  ')

  info('\n本次部署方案为:', `${scheme}\n`)

  info('\n本地项目路径:', `${projectDir}\n`)

  const executeOptions = {
    stdio: 'inherit',
    shell: true,
  }

  const isNodeProject = type === '1'

  // 处理打包
  const build = async () => {
    info('\n🚗  开始打包\n')

    const buildOptions = [
      path.resolve(__dirname, '../sh/build.sh'),
      projectDir,
      buildScript,
      npmRegistry,
    ]

    const builder = spawn('bash', buildOptions, executeOptions)

    builder.on('data', data => {
      info(`build stdout: ${data}`)

      if (data.includes('npm ERR!')) {
        error('\n❌  npm出现未知错误，请尝试删除node_modules和package-lock.json后重装依赖\n')

        process.exit(1)
      }
    })

    builder.on('error', data => {
      error(`\n❌  打包失败： stderr: ${data}\n`)
    })

    builder.on('close', code => {
      info(`build close code: ${code}`)

      if (code === 0) {
        info('\n🚗  打包成功\n')

        tar()
      } else {
        error(`\n❌  打包失败： close code ${code}\n`)
      }
    })
  }

  // 处理压缩打包
  const tar = async () => {
    info('\n🚗  开始压缩\n')

    try {
      const cdDir = isNodeProject ? '../' : './'
      const sourceDir = isNodeProject ? name : distDir

      await shell(`cd ${cdDir} && rm -rf ${name}.tar.gz && tar -czf ${name}.tar.gz ${sourceDir}`)

      info(`\n🚗  压缩成功: ${name}.tar.gz\n`)

      upload()
    } catch (data) {
      error(`\n❌  压缩失败： stderr: ${data}\n`)

      process.exit(1)
    }
  }

  // 处理上传
  const upload = () => {
    info('\n✈️  开始上传\n')

    const tgzSrc = isNodeProject ? `../${name}.tar.gz` : `${name}.tar.gz`

    const uploadOptions = [
      path.resolve(__dirname, '../sh/upload.sh'),
      tgzSrc,
      web,
      dir,
      user,
      pwd,
    ]

    const uploader = spawn('expect', uploadOptions, executeOptions)

    uploader.on('data', data => {
      info(`uploader stdout: ${data}`)
    })

    uploader.on('error', data => {
      error(`❌  上传失败： stderr: ${data}\n`)
    })

    uploader.on('close', async code => {
      info(`uploader close code: ${code}`)

      if (code === 0) {
        info('\n✅  上传成功\n')

        execute()
      } else {
        error(`❌  上传失败： close code: ${code}\n`)
      }
    })
  }

  // 处理部署
  const execute = () => {
    info('\n🛩  开始启动\n')

    const script = isNodeProject ? 'execute' : 'static'

    const executeParams = [
      path.resolve(__dirname, `../sh/${script}.sh`),
      name,
      web,
      dir,
      user,
      pwd,
      distDir,
    ]

    const excuter = spawn('expect', executeParams, executeOptions)

    excuter.on('data', data => {
      info(`execute stdout: ${data}`)
    })

    excuter.on('error', data => {
      error(`❌  启动失败： stderr: ${data}\n`)
    })

    excuter.on('close', code => {
      info(`execute close code: ${code}`)

      if (code === 0) {
        success('\n🎉  🎉  🎉   启动成功，部署完成   🍺  🍺  🍺\n')
      } else {
        error(`❌  启动失败： close code: ${code}\n`)
      }
    })
  }

  // 本地部署流程
  // 需要构建：build -> 打包tar -> 上传upload -> 解压untar -> 启动start
  if (isNeedBuild) {
    build()
  } else {
    // 不需要构建：打包tar -> upload -> untar -> start
    tar()
  }
}

module.exports = (options) => deploy(options)

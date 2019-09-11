#!/usr/bin/env node

const {
  error,
  success,
} = require('./util')
const upload = require('./upload')

function uploadToOSS(options) {
  const {
    target,
    publicDir,
    accessKeyId,
    accessKeySecret,
    bucket,
    region,
    assets,
    build,
  } = options

  if (!(target && build && accessKeyId && accessKeySecret && bucket && region && assets && publicDir)) {
    error('使用oss需传入accessKeyId、accessKeySecret等参数')

    process.exit(1)
  }

  const uploadProcess = (assetsDir) => {
    upload({
      accessKeyId,
      accessKeySecret,
      bucket,
      region,
      assets,
    }, assetsDir).then(() => {
      success('child process exited with success')
    }).catch((e) => {
      error('\n上传失败\n')

      throw e
    })
  }

  uploadProcess(`${target}/${publicDir}`)

  process.on('SIGINT', () => {
    process.exit(0)
  })
}

module.exports = (options) => uploadToOSS(options)

const oss = require('ali-oss');
const fs = require('fs');
const path = require('path');
const co = require('co');
const chalk = require('chalk');

const { log } = console;
const error = chalk.hex('#f33535');
const warning = chalk.keyword('orange');
const info = chalk.cyan;
const success = chalk.green;

module.exports = ({ accessKeyId, accessKeySecret, bucket, region, assets }, publicDir) => {
  const store = oss({
    accessKeyId,
    accessKeySecret,
    bucket,
    region,
  });

  const files = fs.readdirSync(path.join(publicDir));

  return co(function* () {
    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const pathObject = path.parse(f);
        const fileName = `${pathObject.name}${pathObject.ext}`;

        const { res } = yield store.put(`${assets}/${fileName}`, `${publicDir}/${fileName}`);
        const { status } = res;

        log(info(`文件${fileName}上传结果：${status}`));
      }
    } catch (e) {
      throw e;
    }
  }).catch((e) => {
    throw e;
  })
};

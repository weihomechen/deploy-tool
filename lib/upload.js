const oss = require('ali-oss');
const fs = require('fs');
const path = require('path');
const co = require('co');

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

        console.log(`文件${fileName}上传结果：`, status);
      }
    } catch (e) {
      throw e;
    }
  }).catch((e) => {
    throw e;
  })
};

const oss = require('ali-oss');
const fs = require('fs');
const path = require('path');
const co = require('co');

module.exports = (options, dir, name, publicDir) => {
  const store = oss({
    accessKeyId: options.accessKeyId,
    accessKeySecret: options.accessKeySecret,
    bucket: options.bucket,
    region: options.region,
  });
  const files = fs.readdirSync(path.join(dir, name, publicDir));

  return co(function *() {
    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const pathObject = path.parse(f);

        yield store.put(`${options.assets}/${name}/${pathObject.name}${pathObject.ext}`, path.join(dir, name, 'app/public', f));
      }
    } catch (e) {
      throw e;
    }
  }).catch((e) => {
    throw e;
  })
};

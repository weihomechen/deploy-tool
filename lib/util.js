const fs = require('fs-extra');
const path = require('path');

exports.uniqueDirname = (dir, prefix) => {
  let rnd = `${(prefix || '')}${parseInt(Math.random() * 10000).toString()}`;

  try {
    const files = fs.readdirSync(dir);

    while (files.indexOf(rnd) !== -1) {
      rnd = `${(prefix || '')}${parseInt(Math.random() * 10000).toString()}`;
    }
  } catch (e) {
    console.error(e);
  }

  return path.join(dir, rnd);
};

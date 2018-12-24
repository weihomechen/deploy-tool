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

const camelize = (str) => {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
exports.cleanArgs = (cmd) => {
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

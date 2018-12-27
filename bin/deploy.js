#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const semver = require('semver');
const inquirer = require('inquirer');

const requiredVersion = require('../package.json').engines.node;

const { log } = console;
const error = chalk.hex('#f33535');
// const { logStringify } = require('../lib/util');

const data = fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8');
const config = JSON.parse(data);
const {
  defaultConfig,
  projConfigMap
} = config;

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    log(error(
      `You are using Node ${process.version}, but this version of ${id} requires Node ${wanted}.
      \nPlease upgrade your Node version.\n`
    ));
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, '@ifun/deploy');

const checkGlobalConfig = () => {
  const globalConfigKeys = ['web', 'dir', 'user', 'repertoryType', 'branch', 'type', 'isNeedBuild', 'build', 'dist', 'oss'];
  const undefinedKeys = globalConfigKeys.filter(key => defaultConfig[key] === undefined) || [];
  let i = 0;
  let newGlobalConfig = {};

  return new Promise((resolve, reject) => {
    const getAnswer = (i) => {
      if (i >= undefinedKeys.length) {
        resolve(newGlobalConfig);
        return;
      }

      const key = undefinedKeys[i];
      inquirer.prompt([{
        type: 'input',
        name: key,
        message: `global config ${key} is undefined, please input the value`,
      }]).then(answer => {
        if (answer[key] !== undefined) {
          newGlobalConfig[key] = String(answer[key]);
        }
        i++;
        getAnswer(i);
      })
    };

    getAnswer(0);
  });
};

const checkProjectConfig = (name) => {
  const projectConfig = projConfigMap[name] || { name };
  const projectConfigKeys = [
    // web server
    'web',
    'dir',
    'user',
    // repertory info
    'repertoryType',
    'target',
    'branch',
    'type',
    // build config
    'isNeedBuild',
    'build',
    'dist',
    // oss config
    'oss',
  ];

  const undefinedKeys = projectConfigKeys.filter(key => projectConfig[key] === undefined) || [];
  let i = 0;
  let newProjectConfig = {};

  return new Promise((resolve, reject) => {
    const getAnswer = (i) => {
      if (i >= undefinedKeys.length - 1) {
        resolve(newProjectConfig);
        return;
      }

      const key = undefinedKeys[i];
      const globalValue = defaultConfig[key] || '';
      const validater = (input) => {
        if (key === 'target') {
          if (!input) {
            log(error(`config ${key} is required`));
            return false;
          }
        }
        return true;
      };

      inquirer.prompt([{
        type: 'input',
        name: key,
        message: `config ${key} is undefined, please input the value ${globalValue ? `or press enter to use global config(${globalValue})` : ''}`,
        validate: validater,
      }]).then(answer => {
        newProjectConfig[key] = String(answer[key] || globalValue);
        i++;
        getAnswer(i);
      })
    };

    getAnswer(0);
  });
};

const {
  cleanArgs,
} = require('../lib/util');

program
  .version(require('../package').version)
  .usage('<action> [options]');

program
  .command('config <action>')
  .option('-a, --all', '是否读取全部配置')
  .option('-t, --target [target]', 'g-全局配置 项目名(e.g:blog)-项目配置 默认 g-全局')
  .option('-k, --key [key]', '要读取的配置项，不读取全部时必填 e.g. branch')
  .option('-v, --value <value>', '必须，设置配置项的值')
  .action((action, cmd) => {
    const options = cleanArgs(cmd);

    require(`../lib/${action}`)(options);
  });

program
  .command('app <name>')
  .option('-w, --web [web]', 'web服务器')
  .option('-u, --user [user]', 'web服务器用户名')
  .option('-d, --dir [dir]', '要部署到web服务器的目录')
  .option('-r, --repertoryType [repertoryType]', '仓库类型：local -- 本地，remote -- 远程仓库')
  .option('-t, --target [target]', '项目路径，本地项目即为文件路径，远程仓库为仓库地址如git仓库地址')
  .option('-b, --branch [branch]', 'git分支，默认master')
  .option('-e, --type [type]', '项目类型，static -- 前端项目 node -- Node项目')
  .option('--isNeedBuild [isNeedBuild]', '是否需要打包，false -- 不需要，true -- 需要')
  .option('--build [build]', "项目打包命令，如果isNeedBuild值为'true'则必传，默认'build'，会执行‘npm run build’")
  .option('--dist [dist]', '存放打包后文件的目录名')
  .option('-o, --oss [oss]', '是否将静态资源上传到oss')
  .option('-i, --accessKeyId [accessKeyId]', 'oss accessKeyId')
  .option('-s, --accessKeySecret [accessKeySecret]', 'oss accessKeySecret')
  .option('--bucket [bucket]', 'oss bucket')
  .option('--region [region]', 'oss region')
  .option('--assets [assets]', 'oss服务器目录，用来存放要上传的静态资源')
  .option('--publicDir [publicDir]', '该项目要上传的静态资源目录')
  .action(async (name, cmd) => {
    const newGlobalConfig = await checkGlobalConfig();

    if (Object.keys(newGlobalConfig).length) {
      const options = {
        type: 'multiple',
      };
      await require('../lib/set')(options, newGlobalConfig);
    }

    if (projConfigMap[name]) {
      const options = cleanArgs(cmd);
      options.name = name;

      require(`../lib/deploy`)(options);
    } else {
      inquirer.prompt([{
        type: 'confirm',
        name: 'value',
        message: `project ${name} hasn't configurations yet, should create this project in config.json?`,
        default: true,
      }]).then(async ({ value }) => {
        const isNeedWriteConfig = value;
        const projectConfig = await checkProjectConfig();
        projectConfig.name = name;
        if (isNeedWriteConfig) {
          const options = {
            target: name,
            type: 'multiple',
          };
          await require('../lib/set')(options, projectConfig);
          require(`../lib/deploy`)(projectConfig);
        } else {
          require(`../lib/deploy`)(projectConfig);
        }
      })
    }
  });

program
  .command('oss <name>')
  .option('-i, --accessKeyId <accessKeyId>', 'oss accessKeyId')
  .option('-s, --accessKeySecret <accessKeySecret>', 'oss accessKeySecret')
  .option('-p [publicDir]', '项目内要部署到OSS的文件目录')
  .option('-b [bucket]', 'oss bucket')
  .option('-r [region]', 'oss region')
  .option('-a [assets]', 'oss 静态资源目录')
  .action((name, cmd) => {
    const options = cleanArgs(cmd);
    options.name = name;

    require(`../lib/deploy-oss`)(options);
  });

// add some useful info on help
program.on('--help', () => {
  log()
  log(`  Run ${chalk.cyan(`deploy <command> --help`)} for detailed usage of given command.`)
  log()
});

program.commands.forEach(c => c.on('--help', () => console.log()));

program.parse(process.argv);

process.on('SIGINT', () => {
  process.exit(0);
});

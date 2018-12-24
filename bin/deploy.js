#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const semver = require('semver');

const requiredVersion = require('../package.json').engines.node;

const { log } = console;
const error = chalk.hex('#f33535');

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
  .action((name, cmd) => {
    const options = cleanArgs(cmd);
    options.name = name;

    require(`../lib/deploy`)(options);
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

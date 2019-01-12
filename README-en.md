## Description

Deploy web application tool, supports deploying web application to servers

## Features

- ✔︎ Local or remote projcet supported
- ✔︎ Front or Node application supported, Node application will run after deploy
- ✔︎ Upload assets to OSS supported
- ✔︎ Extends default global or project config supported

## Install

```sh
npm i @ifun/deploy -g
```

## Use

```sh
# deploy app
deploy app <name>

# e.g
deploy app blog

# get config
deploy config get [options]

# set config
deploy config set [options]

# upload assets to OSS only
deploy oss <app-name> [options]

# for help
deploy -h

# for more detail
deploy <command> -h

# e.g
deploy app -h

```

Prompt for ssh login password and press Enter to confirm

## Parameter Description

All parameters:  

```sh
  .command('app <name>')
  .option('-w, --web [web]', 'required, web server ip address')
  .option('-u, --user [user]', 'required, web server ssh login user name, default: root')
  .option('-d, --dir [dir]', 'required, web server target dir')
  .option('-r, --repertoryType [repertoryType]', 'repertory type: local/remote, default: local')
  .option('-t, --target [target]', 'required, project path, local: dir local path, remote repertory address, e.g. git repertory address')
  .option('-b, --branch [branch]', 'git branch, default: master')
  .option('-e, --type [type]', 'project type, static/node, default: static')
  .option('--isNeedBuild [isNeedBuild]', 'is need build, false -- no need, true -- need, default: true')
  .option('--build [build]', "build script, if isNeedBuild === 'true', required, default: 'build', will excuet 'npm run ${build}'")
  .option('--dist [dist]', 'proj dir where put builded files, default: dist')
  .option('-o, --oss [oss]', 'is need upload assets to OSS, false/true, default: false')
  .option('-i, --accessKeyId [accessKeyId]', 'oss accessKeyId')
  .option('-s, --accessKeySecret [accessKeySecret]', 'oss accessKeySecret')
  .option('--bucket [bucket]', 'oss bucket')
  .option('--region [region]', 'oss region')
  .option('--assets [assets]', 'oss dir, where put assets')
  .option('--publicDir [publicDir]', 'proj dir where need to upload assets to OSS')

  .command('config <action>')
  .option('-a, --all', 'get all config')
  .option('-t, --target [target]', 'app name, default: g -- global')
  .option('-k, --key [key]', 'config key which will be readed')
  .option('-v, --value <value>', 'config value when be written')

  .command('oss <name>')
  .option('-i, --accessKeyId <accessKeyId>', 'oss accessKeyId')
  .option('-s, --accessKeySecret <accessKeySecret>', 'oss accessKeySecret')
  .option('-p [publicDir]', "project's dir where will be uploaded")
  .option('-b [bucket]', 'oss bucket')
  .option('-r [region]', 'oss region')
  .option('-a [assets]', 'oss server dir to store assets')
```

## Custom default configuration

The default configuration for global and specific projects is located
 `config.json`

### Directly modify `config.json` to implement customization

- Find the globally installed npm package:

```
npm list -g --depth 0
```

![](https://rulifun.oss-cn-hangzhou.aliyuncs.com/static/image/WX20181011-135003%402x.png)

- Modify the `config.json` file :

```
vim /usr/local/lib/node_modules/@ifun/deploy/config.json
```

#### Profile description

```js
{
  "defaultConfig": {                                     // global config
    "web": "118.118.118.118",                            // web server ip address
    "dir": "/var/proj/",                                 // web server dir
    "user": "root",                                      // ssh login user name
    "repertoryType": "local",                            // repertory type, local/remorte
    "branch": "master",                                  // git branch
    "type": "static",                                    // proj type static/node
    "isNeedBuild": "true",                               // is need build, string, false/true
    "build": "build",                                    // if isNeedBuild === 'true', npm run script
    "dist": "build",                                     // proj dir where put builded files
    "oss": "false"                                       // is need upload assets to OSS, string, false/true
  },
  "projConfigMap": {                                      // project config
    "blog": {                                             // project name
      "repertoryType": "remote",                          // repertory type
      "target": "https://github.com/weihomechen/blog.git" // project address
    },
    "blog-node": {
      "target": "/Users/ifun/my-projects/blog-node",
      "type": "node",
      "isNeedBuild": "false"
    },
    "ssr-starter": {
      "repertoryType": "remote",
      "target": "https://github.com/weihomechen/ssr-starter.git",
      "type": "node",
      "oss": "true",
      "publicDir": "build",
      "bucket": "rulifun",
      "region": "oss-cn-hangzhou",
      "assets": "/ssr-starter/client"
    }
  }
}
```

### Command Line

#### Modify by command line

```sh
# @param[all]: get all configs 
deploy config get <target> [key] -a [all]

# Get all configs
deploy config get -a

# Get the global web configuration item
deploy config get global web

# Get project blog's configurations
deploy config get blog

# Get the type configuration item of the project blog
deploy config get blog type

# @param[target]: 
# global config -- g
# proj config -- proj name(e.g:blog)
# default: g
deploy config set <target> <key> <value>

# Modify the global user configuration item
deploy config set global user yourname

# Modify project blog configuration items
deploy config set blog type node

```

#### Temporary modification

Temporarily entered parameters have the highest privilege and override the default configuration of the global and project, only valid once.

```sh
# The `web` parameter passed through the command line will eventually be used.
deploy app blog-node -w 88.88.88.88 
```

## Agreement

The following conventions are the default settings for this project. If you need to change, please modify the configuration file `config.json`.

### front-end
- production env packaging command: `build`
- packaged folder name: `build`

### server-end(node)
- service start: `npm run prod`  
- service stop: `npm run stop`

## Practices

The following projects are deployed through this tool, and the online preview address is on the github page:

- [blog](https://github.com/weihomechen/blog)
- [blog-node](https://github.com/weihomechen/blog-node)
- [react-admin](https://github.com/weihomechen/react-admin)
- [react-admin-node](https://github.com/weihomechen/react-admin-node)
- [vue-mail](https://github.com/weihomechen/vue-mail-front)
- [ssr-starter](https://github.com/weihomechen/ssr-starter)

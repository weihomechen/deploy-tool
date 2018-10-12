## Description

Deploy web application tool, currently supports deploying local projects to servers

## Install

```sh
npm i @ifun/deploy -g
```

## Use

```sh
# deploy project
deploy -n <name> -p <pwd> 

# e.g
deploy -n blog -p 123456
```

## Parameter Description

All parameters： 

```sh
# required
-n, --name <name>, project name
-p, --password <pwd>, web server password

# optional
-t, --target [target], project local path
-w, --web [web], web server ip, e.g:118.118.118.118
-d, --dir [dir], deploy to the server\'s directory
-b, --branch [branch], git branch, default `master`
-u, --user [user], web server user, default `root`
-e, --type [type], project type，static -- front-end project, node -- Node project，   default`static`
--build [build], production env build script，default`build`
--dist [dist], builded folder, default`build`

# warning: testing
-o, --oss [oss], whether to upload static resources to oss
-i, --accessKeyId [accessKeyId], oss accessKeyId
-s, --accessKeySecret [accessKeySecret], oss accessKeySecret
--region [region], oss region
--assets [assets], local project static resource directory
--publicDir [publicDir], oss server static resource directory
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
  "defaultConfig": {              // default config
    "web": "118.25.16.129",       // web server
    "dir": "/var/proj/",          // web server target dir
    "branch": "master",           // git branch
    "build": "build",             // build script define by package.json 
    "dist": "build",              // builded filename
    "user": "root",               // web server ssh user
    "type": "static"              // deploy type static -- front-end project, node -- Node project，
  },
  "projConfigMap": {                                  // project config
    "blog": {                                         // project name
      "target": "/Users/ifun/my-projects/blog"        // project local path
    },
    "blog-node": {
      "target": "/Users/ifun/my-projects/blog-node",
      "type": "node"                                  // project type: node
    },
    "vue-mail": {
      "target": "/Users/ifun/my-projects/vue-mail-front",
      "build": "build:prod",                          // project production env build script
      "dist": "dist"                                  // project builded folder
    },
    "react-admin": {
      "target": "/Users/ifun/my-projects/antd-admin",
      "dist": "dist"
    }
  }
}
```

### Command Line

#### Modify by command line

```sh
# @param[target]: 
# global config -- g
# proj config -- proj name(e.g:blog)
# default: g
deploy-set -t [target] -k <key> -v <value>

# Modify the global user configuration item
deploy-set -k user -v yourname

# Modify project blog configuration items
deploy-set -t blog -k type -v node

# @param[all]: get all configs 
# true-yse, false-no, default: false
deploy-get -a [all] -t [target] -k [key]

# Get all configs
deploy-get -a true

# Get the global web configuration item
deploy-get -k web

# Get the type configuration item of the project blog
deploy-get -t blog -k type

```

#### Temporary modification

Temporarily entered parameters have the highest privilege and override the default configuration of the global and project, only valid once.

```sh
# The `web` parameter passed through the command line will eventually be used.
deploy -n blog-node -p 123456 -w 88.88.88.88 
```

## Agreement

The following conventions are the default settings for this project. If you need to change, please modify the configuration file `config.js`.

### front-end
- production env packaging command: `build`
- packaged folder name: `build`

### server-end(node)
- service start: `npm run prod`  
- service stop: `npm run stop`

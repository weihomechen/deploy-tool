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
deploy app <scheme>

# e.g
deploy app dev

# get config web
deploy config get web

# set config web with value 88.88.88.88
deploy config set web 88.88.88.88

# upload assets to OSS only
deploy oss <app-name> [options]

# for help
deploy -h

# for more detail
deploy <command> -h

# e.g
deploy app -h

```

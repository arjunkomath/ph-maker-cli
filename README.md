ph-maker
========

CLI tool for Product Hunt Makers

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ph-maker.svg)](https://npmjs.org/package/ph-maker)
[![Downloads/week](https://img.shields.io/npm/dw/ph-maker.svg)](https://npmjs.org/package/ph-maker)
[![License](https://img.shields.io/npm/l/ph-maker.svg)](https://github.com/arjunkomath/ph-maker-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ph-maker
$ maker COMMAND
running command...
$ maker (-v|--version|version)
ph-maker/0.0.1 darwin-x64 node-v8.10.0
$ maker --help [COMMAND]
USAGE
  $ maker COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`maker hello [FILE]`](#maker-hello-file)
* [`maker help [COMMAND]`](#maker-help-command)

## `maker hello [FILE]`

describe the command here

```
USAGE
  $ maker hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ maker hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/arjunkomath/ph-maker-cli/blob/v0.0.1/src/commands/hello.ts)_

## `maker help [COMMAND]`

display help for maker

```
USAGE
  $ maker help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_
<!-- commandsstop -->

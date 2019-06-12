<img width="100" src="http://icons.iconarchive.com/icons/xenatt/the-circle/256/App-Terminal-icon.png">

# Product Hunt Maker CLI

CLI tool for Product Hunt Makers

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ph-maker.svg)](https://npmjs.org/package/ph-maker)
[![Downloads/week](https://img.shields.io/npm/dw/ph-maker.svg)](https://npmjs.org/package/ph-maker)
[![License](https://img.shields.io/npm/l/ph-maker.svg)](https://github.com/arjunkomath/ph-maker-cli/blob/master/package.json)

<!-- toc -->
* [Product Hunt Maker CLI](#product-hunt-maker-cli)
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
* [`maker goal [ACTION]`](#maker-goal-action)
* [`maker help [COMMAND]`](#maker-help-command)
* [`maker login`](#maker-login)
* [`maker logout`](#maker-logout)
* [`maker project ACTION`](#maker-project-action)

## `maker goal [ACTION]`

manage goal

```
USAGE
  $ maker goal [ACTION]

ARGUMENTS
  ACTION  (list|create|edit|complete|incomplete) Enter Action
```

_See code: [src/commands/goal.ts](https://github.com/arjunkomath/ph-maker-cli/blob/v0.0.1/src/commands/goal.ts)_

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

## `maker login`

login to product hunt

```
USAGE
  $ maker login
```

_See code: [src/commands/login.ts](https://github.com/arjunkomath/ph-maker-cli/blob/v0.0.1/src/commands/login.ts)_

## `maker logout`

logout

```
USAGE
  $ maker logout
```

_See code: [src/commands/logout.ts](https://github.com/arjunkomath/ph-maker-cli/blob/v0.0.1/src/commands/logout.ts)_

## `maker project ACTION`

manage projects

```
USAGE
  $ maker project ACTION

ARGUMENTS
  ACTION  (list) [default: list] Enter Action
```

_See code: [src/commands/project.ts](https://github.com/arjunkomath/ph-maker-cli/blob/v0.0.1/src/commands/project.ts)_
<!-- commandsstop -->

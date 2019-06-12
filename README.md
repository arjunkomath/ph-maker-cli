<img width="100" src="http://icons.iconarchive.com/icons/xenatt/the-circle/256/App-Terminal-icon.png">
Product Hunt Maker CLI
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
  $ maker [COMMAND]

COMMANDS
  goal     manage goal
  help     display help for maker
  login    login to product hunt
  logout   logout
  project  manage projects
```
<!-- usagestop -->

# Commands
<!-- commands -->

### `maker login`
login to product hunt
```
USAGE
  $ maker login

EXAMPLE
  $ maker login
    
    Login to Product Hunt and get your access token here:
    https://ph-maker-oauth.arjunkomath.now.sh/

? Enter your access token
```

### `maker goal`
see actions for goal
```
USAGE
  $ maker goal

EXAMPLE
  $ maker goal
? What do you want to do? (Use arrow keys)
❯ List goals
  Create goal
  Edit goal
  ──────────────
  Mark goal as complete
  Mark goal as incomplete
  ──────────────
(Move up and down to reveal more choices)
```

### `maker goal [ACTION]`
Action can be `list` | `create` | `edit` | `complete` | `incomplete`
```
USAGE
  $ maker goal [ACTION]

EXAMPLE
  $ maker list

    What are you working on today?

    ● Pending (2/6)

	 ☐  Add tests
	     ♥ 0
	 ☐  Submit for Maker Fest
	     ♥ 1 | Due - in 2 days

    ● Completed (4/6)

	 ✔  Complete CLI tool tomorrow
	     ♥ 0 | Completed - a day ago
	 ✔  Build API documentation
	     ♥ 6 | Completed - a day ago | Project - Push by Techulus
	 ✔  Build website landing page
	     ♥ 0 | Completed - 6 months ago | Project - Push by Techulus

```

### `maker logout`
logout
```
USAGE
  $ maker logout

EXAMPLE
  $ maker logout
    Logout success!
```

### `maker help [COMMAND]`
display help for maker
```
USAGE
  $ maker help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

<!-- commandsstop -->

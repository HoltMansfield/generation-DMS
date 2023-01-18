#!/usr/bin/env node

import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import program from 'commander'

import { addNodeCommands } from './commander/add-node-commands'
import { addReactCommands } from './commander/add-react-commands'
import { addMonorepoCommands } from './commander/add-monorepo-commands'

clear()

console.log(chalk.blue(figlet.textSync('holto-cli', { horizontalLayout: 'full' })))

// set some meta-data
program
  .version('0.0.1')
  .description('Generate node apps, react app and npm packages, and once generated, can generate elements of apps')

// wire up commands
addNodeCommands(program)
addReactCommands(program)
addMonorepoCommands(program)

// listen for user input
program.parse(process.argv)

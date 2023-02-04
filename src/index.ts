#!/usr/bin/env node

import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import program from 'commander'

import { addReactCommands } from './commander/add-react-commands'

clear()

//console.log(chalk.blue(figlet.textSync('dms-cli', { horizontalLayout: 'full' })))

// set some meta-data
program
  .version('0.0.1')
  .description('Generate node apps, react app and npm packages, and once generated, can generate elements of apps')

// wire up commands
addReactCommands(program)

// listen for user input
program.parse(process.argv)

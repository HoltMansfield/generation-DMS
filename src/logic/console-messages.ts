import chalk from 'chalk'
import { serializeError } from 'serialize-error'
/* eslint-disable-next-line no-console  */
const log = console.log

const info = (content: string): void => {
  log(chalk.yellow(content))
}

const label = (label: string, data: Object): void => {
  info(label)
  info(JSON.stringify(data, null, 2))
}

const success = (content: string): void => {
  log(chalk.green(content))
}

const paragraph = (content: string): void => {
  log(chalk.underline.bgBlue(content))
}

const error = (content: string): void => {
  log(chalk.red(content))
}

const handleError = (err: string, title: string): void => {
  error(`******** ERROR HANDLED IN: ${title} ********`)
  log(chalk.green(JSON.stringify(serializeError(err), null, 2)))
  error('***************************************')
}

const json = (data: Object): void => {
  info(JSON.stringify(data, null, 2))
}

export default {
  info,
  label,
  paragraph,
  error,
  handleError,
  json,
  success
}

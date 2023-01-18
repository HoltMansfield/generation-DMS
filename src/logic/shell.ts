import shell, { ShellString } from 'shelljs'
import { exec } from 'child_process'

export const execute = async (command: string): Promise<ShellString> => {
  return shell.exec(command)
}

export const executeAsync = (command: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    exec(command, error => {
      if (error !== null) {
        reject(error)
      }

      resolve(true)
    })
  })
}

export default {
  execute,
  executeAsync
}

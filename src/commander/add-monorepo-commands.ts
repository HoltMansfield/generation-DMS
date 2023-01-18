import { createMonorepo } from '../commands/setup-project/create-monorepo/create-monorepo'

export const addMonorepoCommands = (program: any): void => {
  program
    .command('create-monorepo <projectName>')
    .description('Create a react & node monorepo')
    .action((projectName: string) => createMonorepo(projectName))
}

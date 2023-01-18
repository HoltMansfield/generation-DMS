import { addRoute } from '../commands/in-project/react/add-route/add-route'
import { addHook } from '../commands/in-project/react/add-hook/add-hook'
import { addForm } from '../commands/in-project/react/add-form/add-form'
import { createReactApp } from '../commands/setup-project/create-react-app/create-react-app'

export const addReactCommands = (program: any): void => {
  program
    .command('create-react-app <projectName>')
    .description('Create a react app')
    .action((projectName: string) => createReactApp(projectName))

  program
    .command('add-route <url>')
    .description('Create a route for our react app')
    .action((url: string) => addRoute(url))

  program
    .command('add-hook <hookName>')
    .description('Create a react hook and accompanying test')
    .action((url: string) => addHook(url))

  program
    .command('add-form <formName>')
    .description('Create a form based on JSON specification')
    .action((formName: string) => addForm(formName))
}

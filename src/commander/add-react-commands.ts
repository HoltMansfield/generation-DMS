import { addCollectionApi } from "../commands/in-project/react/add-collection-api/add-collection-api"
import { initializeDms } from "../commands/setup-project/initialize-dms/initialize"


export const addReactCommands = (program: any): void => {
  program
    .command('initialize')
    .description('Initialize a react app for usage with Generation-DMS')
    .action(() => initializeDms())

  program
    .command('add-collection-api <collectionName>')
    .description('Create hooks for communicating with the backend for a given collection')
    .action((collectionName: string) => addCollectionApi(collectionName))
}

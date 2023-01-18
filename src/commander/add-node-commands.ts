import { createNodeApi } from '../commands/setup-project/create-node-api/create-node-api'
import { createNodeNpmPackage } from '../commands/setup-project/create-node-npm-package/create-node-npm-package'
import { createReactNpmPackage } from '../commands/setup-project/create-react-npm-package/create-react-npm-package'
//import { generateInterfaces } from '../commands/in-project/node/generate-interfaces/_generate-interfaces'
import { generateInterface } from '../commands/in-project/node/generate-interfaces/generate-interface'
import { addCollectionEndpoints } from '../commands/in-project/node/add-collection-endpoints/add-collection-endpoints'

export const addNodeCommands = (program: any): void => {
  program
    .command('create-node-api <projectName>')
    .description('Create a node api project using express and typeorm')
    .action((projectName: string) => createNodeApi(projectName))

  program
    .command('create-node-npm-package <projectName>')
    .description('Create an npm package for node.js')
    .action((projectName: string) => createNodeNpmPackage(projectName))

  program
    .command('create-react-npm-package <projectName>')
    .description('Create an npm package react.js')
    .action((projectName: string) => createReactNpmPackage(projectName))

  // program
  //   .command('generate-interfaces')
  //   .description('Generate typescript interfaces from Mongoose Shemas')
  //   .action(() => generateInterfaces())

  program
    .command('generate-interface <collectionName>')
    .description('Generate single typescript interfaces from a Mongoose Shema')
    .action((collectionName: string) => generateInterface(collectionName))

  program
    .command('add-collection-endpoints <collectionName>')
    .description('Generate typescript interfaces from Mongoose Shemas')
    .action(collectionName => addCollectionEndpoints(collectionName))
}

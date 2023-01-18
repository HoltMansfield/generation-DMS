import shell from '../../../logic/shell'
import messages from '../../../logic/console-messages'
import fileSystem from '../../../logic/file-system'
import { addStaticTemplates, addDynamicTemplates, updateDynamicTemplates } from '../../../logic/template-manager'
import templateJson from './templates/templates.json'
import { createNodeApiForMonorepo } from '../create-node-api/create-node-api'
import { createReactAppForMonorepo } from '../create-react-app/create-react-app'

const createFolders = async (root: string, projectName: string): Promise<void> => {
  try {
    await fileSystem.makeDirectory(root)
    await fileSystem.makeDirectory(`${root}/backend`)
    await fileSystem.makeDirectory(`${root}/backend/src/data/repositories`)
    await fileSystem.makeDirectory(`${root}/backend/src/logic`)
    await fileSystem.makeDirectory(`${root}/backend/src/server/controllers`)
    await fileSystem.makeDirectory(`${root}/backend/src/server/e2e`)
    await fileSystem.makeDirectory(`${root}/frontend`)
    await fileSystem.makeDirectory(`${root}/data-model`)
    await fileSystem.makeDirectory(`${root}/packages`)
  } catch (e) {
    messages.handleError(e, 'createFolders')
  }
}

const initialize = async (projectName: string): Promise<any> => {
  const root = `${process.cwd()}/${projectName}`
  await createFolders(root, projectName)
  const sourceFolder = fileSystem.getSourceFolder(__dirname)
  const templateData = { projectName }
  const templates: any[] = templateJson
  updateDynamicTemplates(templates, templateData)

  return { root, sourceFolder, templateData, templates }
}

export const createMonorepo = async (projectName: string): Promise<void> => {
  try {
    const { root, sourceFolder, templateData, templates } = await initialize(projectName)

    await addDynamicTemplates(root, templateData, templates, sourceFolder)
    await addStaticTemplates(sourceFolder, root)

    messages.info('\r\nPlease wait while we do a yarn install...\r\n')
    await shell.executeAsync(`cd ${root} && yarn`)

    // Do I need this?
    //await shell.executeAsync(`cd ${root}/data-model && yarn prepare`) // need to build user dataModel which we already reference

    messages.success('***********************************************************')
    messages.success(`Created frontend in folder: ${projectName}/frontend`)
    messages.success(`Created backend in folder: ${projectName}/backend`)
    messages.success(`Created data-model in folder: ${projectName}/data-model`)
    messages.success(`cd ${projectName} to get started`)
    messages.success('***********************************************************')
  } catch (e) {
    messages.handleError(e, 'createNodeApi')
  }
}

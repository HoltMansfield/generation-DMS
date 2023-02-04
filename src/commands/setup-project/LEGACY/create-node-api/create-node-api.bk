import shell from '../../../logic/shell'
import messages from '../../../logic/console-messages'
import fileSystem from '../../../logic/file-system'
import { addStaticTemplates, addDynamicTemplates, updateDynamicTemplates } from '../../../logic/template-manager'
import templateJson from './templates/templates.json'

const createFolders = async (root: string): Promise<void> => {
  try {
    await fileSystem.makeDirectory(root)
    await fileSystem.makeDirectory(`${root}/env`)
  } catch (e) {
    messages.handleError(e, 'createFolders')
  }
}

const initialize = async (templateData: any, rootSuffix = ''): Promise<any> => {
  let root = `${process.cwd()}/${templateData.projectName}`

  if (rootSuffix.length) {
    root = `${root}/${rootSuffix}`
  }

  await createFolders(root)
  const sourceFolder = fileSystem.getSourceFolder(__dirname)
  const templates: any[] = templateJson
  updateDynamicTemplates(templates, templateData)

  return { root, sourceFolder, templateData, templates }
}

export const createNodeApiForMonorepo = async (
  projectName: string,
  typesDependency: string,
  packageName: string
): Promise<void> => {
  try {
    const { root, sourceFolder, templateData, templates } = await initialize(
      { projectName, typesDependency, packageName },
      'backend'
    )

    await addDynamicTemplates(root, templateData, templates, sourceFolder)
    await addStaticTemplates(sourceFolder, root)

    messages.success(`Created a node API in folder: ${projectName}/backend`)
  } catch (e) {
    messages.handleError(e, 'createNodeApi')
  }
}

export const createNodeApi = async (projectName: string): Promise<void> => {
  try {
    const { root, sourceFolder, templateData, templates } = await initialize({
      projectName,
      typesDependency: null,
      packageName: null
    })

    await addDynamicTemplates(root, templateData, templates, sourceFolder)
    await addStaticTemplates(sourceFolder, root)

    messages.info('\r\nPlease wait while we do an npm install...\r\n')

    await shell.executeAsync(`cd ${root} && npm i`)

    messages.success('***********************************************************')
    messages.success(`Created a new npm package in folder: ${projectName}`)
    messages.success(`cd ${projectName} to get started`)
    messages.success('***********************************************************')
  } catch (e) {
    messages.handleError(e, 'createNodeApi')
  }
}

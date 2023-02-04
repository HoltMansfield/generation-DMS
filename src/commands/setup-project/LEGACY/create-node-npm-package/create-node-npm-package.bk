import shell from '../../../logic/shell'
import messages from '../../../logic/console-messages'
import fileSystem from '../../../logic/file-system'
import { addDynamicTemplates } from '../../../logic/template-manager'
import templateJson from './templates/templates.json'

const getTemplateData = (projectName: string): any => {
  return {
    projectName
  }
}

const updateDynamicTemplates = (templates: any, templateData: any): void => {
  templates = JSON.stringify(templates, null, 2)
  templates = templates.replace(/<%= projectName %>/g, templateData.projectName)
  templates = JSON.parse(templates)
}

const createFolders = async (root: string): Promise<void> => {
  try {
    await fileSystem.makeDirectory(root)
    await fileSystem.makeDirectory(`${root}/src`)
    await fileSystem.makeDirectory(`${root}/.circleci`)
  } catch (e) {
    messages.handleError(e, 'createFolders')
  }
}

export const createNodeNpmPackage = async (projectName: string): Promise<void> => {
  try {
    const templates: any[] = templateJson
    const root = `${process.cwd()}/finaeo-${projectName}`
    const sourceFolder = fileSystem.getSourceFolder(__dirname)
    const templateData = getTemplateData(projectName)
    updateDynamicTemplates(templates, templateData)
    await createFolders(root)
    await addDynamicTemplates(root, templateData, templates, sourceFolder)

    messages.info('')
    messages.info('Please wait while we do an npm install...')
    messages.info('')

    await shell.executeAsync(`cd ${root} && npm i`)

    messages.success('***********************************************************')
    messages.success(`Created a new npm package in folder: finaeo-${projectName}`)
    messages.success(`cd finaeo-${projectName} to get started`)
    messages.success('***********************************************************')
  } catch (e) {
    messages.handleError(e, 'createNpmPackage')
  }
}

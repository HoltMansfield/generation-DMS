import shell from '../../../logic/shell'
import messages from '../../../logic/console-messages'
import fileSystem from '../../../logic/file-system'
import { addDynamicTemplates, addStaticTemplates } from '../../../logic/template-manager'
import templateJson from './templates/templates.json'

const updateDynamicTemplates = (templates: any, templateData: any): void => {
  templates = JSON.stringify(templates, null, 2)
  templates = templates.replace(/<%= projectName %>/g, templateData.projectName)
  templates = JSON.parse(templates)
}

const createFolders = async (root: string): Promise<void> => {
  try {
    await fileSystem.makeDirectory(root)
  } catch (e) {
    messages.handleError(e, 'createFolders')
  }
}

export const createReactAppForMonorepo = async (
  projectName: string,
  typesDependency: string,
  packageName: string
): Promise<void> => {
  try {
    const templates: any[] = templateJson
    const root = `${process.cwd()}/${projectName}/frontend`
    const sourceFolder = fileSystem.getSourceFolder(__dirname)
    const templateData = { projectName, typesDependency, packageName }
    updateDynamicTemplates(templates, templateData)

    await createFolders(root)
    await addDynamicTemplates(root, templateData, templates, sourceFolder)
    await addStaticTemplates(sourceFolder, root)

    messages.success(`Created a new react app in folder: ${projectName}/frontend`)
  } catch (e) {
    messages.handleError(e, 'createReactAppForMonrepo')
  }
}

export const createReactApp = async (projectName: string): Promise<void> => {
  try {
    const templates: any[] = templateJson
    const root = `${process.cwd()}/${projectName}`
    const sourceFolder = fileSystem.getSourceFolder(__dirname)
    const templateData = { projectName }
    updateDynamicTemplates(templates, templateData)
    await createFolders(root)
    await addDynamicTemplates(root, templateData, templates, sourceFolder)
    await addStaticTemplates(sourceFolder, root)
    messages.info('Static templates have been copied over')

    messages.info('')
    messages.info('Please wait while we do an npm install...')
    messages.info('')

    // the app we just created lives in a monorepo so we go up one level to do a yarn install at the monorepo level
    const installPath = process.cwd().replace('packages', '')
    await shell.executeAsync(`cd ${installPath} && yarn install`)

    messages.success('***********************************************************')
    messages.success(`Created a new react app in folder: ${projectName}`)
    messages.success(`cd ${projectName} to get started`)
    messages.success('***********************************************************')
  } catch (e) {
    messages.handleError(e, 'createNodeApi')
  }
}

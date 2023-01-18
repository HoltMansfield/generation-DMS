import messages from '../../../../logic/console-messages'
import fileSystem from '../../../../logic/file-system'
import strings from '../../../../logic/strings'
import templateJson from './templates/templates.json'
import { addDynamicTemplates } from '../../../../logic/template-manager'

export interface TemplateDataBag {
  hookName: string
  hookNamePascalCase: string
  hookNameSnakeCase: string
}

const getTemplateData = (hookName: string): TemplateDataBag => {
  return {
    hookName,
    hookNamePascalCase: strings.capitalizeFirstLetter(hookName),
    hookNameSnakeCase: strings.mapToSnakeCase(hookName)
  }
}

const updateDynamicTemplates = (templates: any, templateData: any): any => {
  templates = JSON.stringify(templates, null, 2)
  templates = templates.replace(/<%= hookNameSnakeCase %>/g, templateData.hookNameSnakeCase)
  templates = templates.replace(/<%= hookName %>/g, templateData.hookName)
  templates = JSON.parse(templates)

  return templates
}

export const createFolders = async (templateData: TemplateDataBag, root: string): Promise<void> => {
  await fileSystem.makeDirectory(`${root}/src/hooks/${templateData.hookNameSnakeCase}`)
}

export const addHook = async (hookName: string): Promise<void> => {
  try {
    const root = `${process.cwd()}`
    const sourceFolder = fileSystem.getSourceFolder(__dirname)
    const templateData = getTemplateData(hookName)
    let templates: any[] = templateJson
    templates = updateDynamicTemplates(templates, templateData)
    await createFolders(templateData, root)
    await addDynamicTemplates(root, templateData, templates, sourceFolder)
  } catch (e) {
    messages.handleError(e, 'addHook')
  }
}

module.exports = {
  addHook
}

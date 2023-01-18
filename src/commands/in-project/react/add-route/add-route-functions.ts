import strings from '../../../../logic/strings'
import messages from '../../../../logic/console-messages'
import fileSystem from '../../../../logic/file-system'

export interface TemplateDataBag {
  url: string
  urlPascalCase: string
  urlSnakeCase: string
}

export const getTemplateData = (url: string): TemplateDataBag => {
  return {
    url,
    urlPascalCase: strings.capitalizeFirstLetter(url),
    urlSnakeCase: strings.mapToSnakeCase(url)
  }
}

export const updateDynamicTemplates = (templates: any, templateData: any): any => {
  templates = JSON.stringify(templates, null, 2)
  templates = templates.replace(/<%= urlSnakeCase %>/g, templateData.urlSnakeCase)
  templates = templates.replace(/<%= urlPascalCase %>/g, templateData.urlPascalCase)
  templates = JSON.parse(templates)

  return templates
}

export const createFolders = async (templateData: TemplateDataBag, root: string): Promise<void> => {
  await fileSystem.makeDirectory(`${root}/src/components/routes/${templateData.urlSnakeCase}`)
}

export const validateUrl = (url: string): boolean => {
  if (url.includes('-')) {
    messages.error('Validation Failure!')
    messages.info(
      `The expected url synax is camelCase. You entered dashes. Finaeo-cli will map zebraMuffin to zebra-muffin`
    )

    return false
  }

  return true
}

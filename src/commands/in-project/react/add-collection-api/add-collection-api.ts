import pluralize from 'pluralize'
import shell from '../../../../logic/shell'
import messages from '../../../../logic/console-messages'
import fileSystem from '../../../../logic/file-system'
import { addDynamicTemplates, updateDynamicTemplates } from '../../../../logic/template-manager'
import templateJson from './templates/templates.json'
import strings from '../../../../logic/strings'

const getTemplateData = (collectionName: string) => {
  const collectionNamePlural =  pluralize(collectionName)

  const templateData: any = {
    collectionName,
    collectionNamePlural: collectionNamePlural,
    collectionNamePluralPascalCase: strings.capitalizeFirstLetter(collectionNamePlural),
    collectionNamePascalCase: strings.capitalizeFirstLetter(collectionName),
    collectionNameSnakeCase: strings.mapToSnakeCase(collectionName)
  }

  return templateData
}

const createFolders = async (collectionApiFolder: string): Promise<void> => {
  try {
    await fileSystem.makeDirectory(collectionApiFolder)
  } catch (e) {
    //@ts-ignore
    messages.handleError(e, 'createFolders')
  }
}

export const addCollectionApi = async (collectionName: string): Promise<void> => {
  try {
    const root = `${process.cwd()}`
    const dmsRoot = `${root}/DMS`
    const templateData = getTemplateData(collectionName)
    // const sniffNpm = `${root}/package-lock.json`
    const sourceFolder = fileSystem.getSourceFolder(__dirname)
    const collectionApiFolder = `${root}/src/DMS/hooks/api/collections/${templateData.collectionNameSnakeCase}`

    await createFolders(collectionApiFolder)
    messages.info(`May have created a folder: ${collectionApiFolder}`)
    let templates: any[] = templateJson
    templates = updateDynamicTemplates(templates, templateData)
    await addDynamicTemplates(root, templateData, templates, sourceFolder)

    // messages.info(`Collection Name: ${JSON.stringify(templateData, null, 2)}`)
    // messages.info(`templates: ${JSON.stringify(templates, null, 2)}`)
  } catch (e) {
    //@ts-ignore
    messages.handleError(e, 'addCollectionApi')
  }
}

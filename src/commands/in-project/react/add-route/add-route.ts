import messages from '../../../../logic/console-messages'
import fileSystem from '../../../../logic/file-system'
import { addDynamicTemplates } from '../../../../logic/template-manager'
import templateJson from './templates/templates.json'
import {
  validateUrl,
  getTemplateData,
  updateDynamicTemplates,
  createFolders,
  TemplateDataBag
} from './add-route-functions'

const updateRouteTable = async (templateData: TemplateDataBag, root: string): Promise<void> => {
  try {
    const pathToRouteTable = `${root}/src/components/routes/RouteTable.tsx`
    const lines = await fileSystem.getLines(pathToRouteTable)

    const component = templateData.urlPascalCase
    const newImportText = `const ${component} = Loadable({ loader: () => import('./${templateData.urlSnakeCase}/${component}'), loading: Spinner })`
    fileSystem.insertInFirstBlankLine(lines, newImportText)

    const newRouteText = `      <AuthorizedRoute path="/${templateData.urlSnakeCase}" component={${templateData.urlPascalCase}} />`
    fileSystem.insertAboveGeneratorTag(lines, '</StyledRouter>', newRouteText)

    const text = lines.map(line => line.text)
    const data = text.join('\r\n') + '\r\n'
    await fileSystem.writeFile(pathToRouteTable, data)
    messages.success('Updated RouteTable.jsx')
  } catch (e) {
    messages.handleError(e, 'updateRouteTable')
  }
}

const updatePreLoader = async (templateData: TemplateDataBag, root: string): Promise<void> => {
  try {
    const pathToPreloader = `${root}/src/hooks/core/use-preload-routes/usePreloadRoutes.ts`
    const lines = await fileSystem.getLines(pathToPreloader)

    const component = templateData.urlPascalCase
    const newImportText = `const ${component} = Loadable({ loader: () => import('../../../components/routes/${templateData.urlSnakeCase}/${component}'), loading })`
    fileSystem.insertBelowGeneratorTag(lines, '//GeneratorToken: <next-import>', newImportText)

    const newPreloadText = `  ${component}.preload()`
    fileSystem.insertBelowGeneratorTag(lines, '//GeneratorToken: <next-preload>', newPreloadText)

    const text = lines.map(line => line.text)
    const data = text.join('\r\n') + '\r\n'
    await fileSystem.writeFile(pathToPreloader, data)
    messages.success('Updated usePreloadRoutes.ts')
  } catch (e) {
    messages.handleError(e, 'updatePreLoader')
  }
}

export const addRoute = async (url: string): Promise<void> => {
  try {
    if (!validateUrl(url)) {
      return
    }

    const root = `${process.cwd()}`
    const sourceFolder = fileSystem.getSourceFolder(__dirname)
    const templateData = getTemplateData(url)
    let templates: any[] = templateJson
    templates = updateDynamicTemplates(templates, templateData)
    await createFolders(templateData, root)
    messages.json(templates)
    await addDynamicTemplates(root, templateData, templates, sourceFolder)
    await updateRouteTable(templateData, root)
    await updatePreLoader(templateData, root)
  } catch (e) {
    messages.handleError(e, 'addRoute')
  }
}

import _ from 'lodash'
import fileSystem from './file-system'
import messages from './console-messages'
import shell from './shell'

export const addStaticTemplates = async (sourceFolder: string, root: string): Promise<any> => {
  // copy over the whole root
  const templateRootPath = `${sourceFolder}/static-templates`
  const result = await shell.executeAsync(`cp -a ${templateRootPath}/. ${root}/`)
  messages.info('Static Templates have been added')

  return result
}

export const addDynamicTemplates = async (
  root: string,
  templateData: any,
  templates: any[],
  sourceFolder: string
): Promise<any[]> => {
  const promises: any = []

  for (const template of templates) {
    const templatePath = `${sourceFolder}/templates/${template.templatePath}`

    let templateFileContent = await fileSystem.readFile(templatePath)

    // create a lodash template
    const compiled = _.template(templateFileContent, { interpolate: /<%=([\s\S]+?)%>/g })
    // compile the template and data
    templateFileContent = compiled(templateData)

    // where the file will live in the final project
    const destinationPath = `${root}/${template.destinationPath}`
    messages.info(destinationPath)

    // queue the file to be written to disk
    promises.push(fileSystem.writeFile(destinationPath, templateFileContent))
    messages.info(`Added file: ${destinationPath}`)
  }

  const results = await Promise.all(promises)
  messages.info('Dynamic Templates have been added')

  return results
}

export const updateDynamicTemplates = (templates: any, templateData: any): any => {
  //messages.info('initialTemplates' + templates)
  templates = JSON.stringify(templates)
  //messages.info('afterstringy' + templates)

  // update all the templates with all the keys in templateData
  Object.keys(templateData).forEach(key => {
    //const regex = RegExp(`<%= ${key} %>`, 'g')
    //messages.info('regex =>  ' + regex.toString())
    //const test = regex.test(templates)
    //messages.info('test => ' + test)
    //templates = templates.replace(`<%= ${key} %>`, templateData[key])
    templates = templates.split(`<%= ${key} %>`).join(templateData[key])
  })

  //messages.info('afterLoop' + templates)

  templates = JSON.parse(templates)

  return templates
}

import pluralize from 'pluralize'
import messages from '../../../../logic/console-messages'
import { addDynamicTemplates, updateDynamicTemplates } from '../../../../logic/template-manager'
import templateJson from './templates/templates.json'
import fileSystem from '../../../../logic/file-system'
import strings from '../../../../logic/strings'
import { generateInterface } from '../generate-interfaces/generate-interface'
import { addCollectionEndpointsForMultiSchema } from './add-collection-endpoints-for-multi-schema'

const validateSubDocs = async (collectionName: string): Promise<any> => {
  const docPath = `${process.cwd()}/src/interfaces/${collectionName}`
  return fileSystem.exists(docPath)
}

const validate = async (collectionName: string): Promise<any> => {
  const docPath = `${process.cwd()}/src/interfaces/${collectionName}-doc.ts`
  const potoPath = `${process.cwd()}/src/interfaces/${collectionName}-doc.ts`
  const docInterfaceExists = fileSystem.exists(docPath)
  const potoInterfaceExists = fileSystem.exists(potoPath)

  if (!docInterfaceExists || !potoInterfaceExists) {
    return validateSubDocs(collectionName)
  }

  return true
}

// interfaceProperties is from a typescript interface generated from the mongoose schema
const getFakeProperties = (interfaceProperties: string[]): string => {
  let fakeProperties: string[] = []

  // map the type to a function call to get mock data
  interfaceProperties.forEach(prop => {
    if (!prop.includes('?')) {
      const propName = prop.split(':')[0].trim()
      const propType = prop.split(':')[1].trim()

      switch (propType) {
        case 'string':
          fakeProperties.push(`  ${propName}: fakerFactory.getString()`)
          break
        case 'number':
          fakeProperties.push(`  ${propName}: fakerFactory.getNumber()`)
          break
        case 'boolean':
          fakeProperties.push(`  ${propName}: fakerFactory.getBoolean()`)
          break
        case 'Date':
          fakeProperties.push(`  ${propName}: fakerFactory.getDatetime()`)
          break
        case 'string[]':
          fakeProperties.push(`  ${propName}: fakerFactory.getArrayOfStrings()`)
          break
        case 'number[]':
          fakeProperties.push(`  ${propName}: fakerFactory.getArrayOfNumbers()`)
          break
        case 'boolean[]':
          fakeProperties.push(`  ${propName}: fakerFactory.getArrayOfBooleans()`)
          break
        case 'Date[]':
          fakeProperties.push(`  ${propName}: fakerFactory.getArrayOfDatetimes()`)
          break
      }
    }
  })

  // add a comma to all but the last property
  fakeProperties = fakeProperties.map((prop, index) => {
    if (index < fakeProperties.length - 1) {
      return `${prop},`
    }

    return prop
  })
  // map it all back to a single string we can stick in a file
  return fakeProperties.join('\n')
}

const getExpectProperties = (interfaceProperties: string[], collectionName: string): string => {
  const expectProperties: string[] = []

  interfaceProperties.forEach(prop => {
    if (!prop.includes('?')) {
      const propName = prop.split(':')[0].trim()
      const propType = prop.split(':')[1].trim()

      switch (propType) {
        case 'Date':
          expectProperties.push(`  expect(new Date(response.body.${propName})).toEqual(${collectionName}.${propName})`)
          break
        case 'Date[]':
          expectProperties.push(
            `  expect(response.body.${propName}.map(d => new Date(d))).toEqual(${collectionName}.${propName})`
          )
          break
        default:
          expectProperties.push(`  expect(response.body.${propName}).toEqual(${collectionName}.${propName})`)
      }
    }
  })

  return expectProperties.join('\n')
}

const getFirstRequiredProperty = (interfaceProperties: string[], collectionName: string): string => {
  let firstProp = ''

  // return first required property
  for (const prop of interfaceProperties) {
    if (!prop.includes('?')) {
      firstProp = prop.split(':')[0].trim()
      break
    }
  }

  // return first property as a fallback
  for (const prop of interfaceProperties) {
    if (prop.includes('_id')) {
      continue
    }
    if (prop.includes('?')) {
      firstProp = prop.split(':')[0].trim()
      // removing the trailing ?
      firstProp = firstProp.substr(0, firstProp.length - 1)
      break
    }
  }

  if (!firstProp.length) {
    throw new Error(`The interface for ${collectionName} does not have any properties`)
  }

  return firstProp
}

const getTemplateData = async (collectionName: string): Promise<any> => {
  const collectionNamePlural = pluralize(collectionName)
  const collectionNamePluralPascalCase = strings.capitalizeFirstLetter(collectionNamePlural)
  const collectionNamePascalCase = strings.capitalizeFirstLetter(collectionName)

  const basePath = process.cwd().replace('backend', '')
  const pathToInterfaceCollections = `${basePath}data-model/src/collections/`

  const interfaceArray = await fileSystem.getArray(`${pathToInterfaceCollections}/${collectionName}.ts`)
  const interfaceProperties = interfaceArray.slice(1, interfaceArray.length - 1)
  const fakeProperties = getFakeProperties(interfaceProperties)
  const expectProperties = getExpectProperties(interfaceProperties, collectionName)
  const firstRequiredProperty = getFirstRequiredProperty(interfaceProperties, collectionName)
  const interfacePath = collectionNamePascalCase
  const segments = basePath.split('/')
  const projectName = segments[segments.length - 2]

  return {
    collectionName,
    collectionNamePlural,
    collectionNamePascalCase,
    collectionNamePluralPascalCase,
    fakeProperties,
    expectProperties,
    firstRequiredProperty,
    interfacePath,
    projectName
  }
}

const initialize = async (collectionName: string): Promise<any> => {
  const root = `${process.cwd()}`
  const sourceFolder = fileSystem.getSourceFolder(__dirname)
  const templateData = await getTemplateData(collectionName)
  let templates: any[] = templateJson
  templates = updateDynamicTemplates(templates, templateData)

  return { root, sourceFolder, templates, templateData }
}

const countSubDocuments = (lines: any[]): number => {
  const count = lines.filter(x => {
    return x.text.includes('new Schema({')
  }).length
  return count
}

const countSchemas = async (collectionName: string): Promise<number> => {
  const collectionPath = `${process.cwd()}/src/data/collections/${collectionName}.ts`
  const lines = await fileSystem.getLines(collectionPath)
  return countSubDocuments(lines)
}

export const addCollectionEndpoints = async (collectionName: string): Promise<void> => {
  try {
    const isValid = await validate(collectionName)
    if (!isValid) {
      // interfaces don't exist yet, so we create them
      await generateInterface(collectionName)
    }

    const numberOfSchemas = await countSchemas(collectionName)

    // WTF why is this zero?
    if (numberOfSchemas === 0) {
      // stay here and use this generator
      const { root, sourceFolder, templateData, templates } = await initialize(collectionName)
      await addDynamicTemplates(root, templateData, templates, sourceFolder)
    }

    return addCollectionEndpointsForMultiSchema(collectionName)
  } catch (e) {
    //@ts-ignore
    messages.handleError(e, 'add-collection-endpoints')
  }

  return
}

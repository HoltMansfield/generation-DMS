import pluralize from 'pluralize'
import messages from '../../../../logic/console-messages'
import { addDynamicTemplates, updateDynamicTemplates } from '../../../../logic/template-manager'
import templateJson from './templates/templates.json'
import fileSystem from '../../../../logic/file-system'
import fs from 'fs'
import strings from '../../../../logic/strings'

const getInlineSubDocument = (interfaceProperties: string[]) => {
  let fakeProperties: string[] = []
  interfaceProperties = interfaceProperties.filter(x => !x.includes('_id'))// drop the _id prop

  // map the type to a function call to get mock data
  interfaceProperties.forEach(prop => {
    const propName = prop.split(':')[0].trim()
      .replace('?', '') // trim the typescript optional operator
    const propType = prop.split(':')[1].trim()

    switch (propType) {
      case 'string':
        fakeProperties.push(`    ${propName}: fakerFactory.getString()`)
        break
      case 'number':
        fakeProperties.push(`    ${propName}: fakerFactory.getNumber()`)
        break
      case 'boolean':
        fakeProperties.push(`    ${propName}: fakerFactory.getBoolean()`)
        break
      case 'Date':
        fakeProperties.push(`    ${propName}: fakerFactory.getDatetime()`)
        break
      case 'string[]':
        fakeProperties.push(`    ${propName}: fakerFactory.getArrayOfStrings()`)
        break
      case 'number[]':
        fakeProperties.push(`    ${propName}: fakerFactory.getArrayOfNumbers()`)
        break
      case 'boolean[]':
        fakeProperties.push(`    ${propName}: fakerFactory.getArrayOfBooleans()`)
        break
      case 'Date[]':
        fakeProperties.push(`    ${propName}: fakerFactory.getArrayOfDatetimes()`)
        break
    }
  })

  // add a comma to all but the last property
  fakeProperties = fakeProperties.map((prop, index) => {
    if (index < fakeProperties.length - 1) {
      return `${prop},`
    }

    return prop
  })

  // open brace for the object being defined
  fakeProperties.unshift('{')

  // closing brace for the object being defined
  fakeProperties.push('  }')

  // map it all back to a single string we can stick in a file
  return fakeProperties.join('\n')
}

const getFakePropertyValue = (prop: string, fakeProperties: string[]) => {
  const propName = prop.split(':')[0].trim()
    .replace('?', '') // trim the typescript optional operator
  const propType = prop.split(':')[1].trim()

  switch (propType) {
    case 'string':
      fakeProperties.push(`      ${propName}: fakerFactory.getString()`)
      break
    case 'number':
      fakeProperties.push(`      ${propName}: fakerFactory.getNumber()`)
      break
    case 'boolean':
      fakeProperties.push(`      ${propName}: fakerFactory.getBoolean()`)
      break
    case 'Date':
      fakeProperties.push(`      ${propName}: fakerFactory.getDatetime()`)
      break
    case 'string[]':
      fakeProperties.push(`      ${propName}: fakerFactory.getArrayOfStrings()`)
      break
    case 'number[]':
      fakeProperties.push(`      ${propName}: fakerFactory.getArrayOfNumbers()`)
      break
    case 'boolean[]':
      fakeProperties.push(`      ${propName}: fakerFactory.getArrayOfBooleans()`)
      break
    case 'Date[]':
      fakeProperties.push(`      ${propName}: fakerFactory.getArrayOfDatetimes()`)
      break
  }
}
    // add a comma to all but the last property
const addCommaSeparators = (fakeProperties: string[]) => {
  return fakeProperties.map((prop, index) => {
    if (index < fakeProperties.length - 1) {
      return `${prop},`
    }

    return prop
  })
}

const wrapInObject = (fakeProperties: string[]) => {
  // open brace for the start of the array
  fakeProperties.unshift('    {')

  // closing brace for the start of the array
  fakeProperties.push('    },')
}

const getFakeObject = (interfaceProperties: string[]) => {
  let fakeProperties: string[] = []
  interfaceProperties.forEach(prop => getFakePropertyValue(prop, fakeProperties))
  fakeProperties = addCommaSeparators(fakeProperties)
  wrapInObject(fakeProperties)

  return fakeProperties
}

const getInlineSubDocuments = (interfaceProperties: string[]) => {
  interfaceProperties = interfaceProperties.filter(x => !x.includes('_id'))// drop the _id prop
  const fakeProperties = [
    ...getFakeObject(interfaceProperties),
    ...getFakeObject(interfaceProperties),
    ...getFakeObject(interfaceProperties)]

  // open brace for the start of the array
  fakeProperties.unshift('[')

  // closing brace for the start of the array
  fakeProperties.push('  ]')

  // map it all back to a single string we can stick in a file
  return fakeProperties.join('\n')
}

// interfaceProperties is from a typescript interface generated from the mongoose schema
const getFakePropertiesForInterface = (interfaceProperties: string[], interfaces: InterfaceDefinition[]): string => {
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
        default:
          const isArray = prop.includes('[]')
          const interfaceForSubDocument = isArray 
          ? interfaces.find(i => pluralize(i.name) === propName)?.properties
          : interfaces.find(i => i.name === propName)?.properties
          isArray
          ? fakeProperties.push(`  ${propName}: ${getInlineSubDocuments(interfaceForSubDocument || [])}`)
          : fakeProperties.push(`  ${propName}: ${getInlineSubDocument(interfaceForSubDocument || [])}`)
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

interface FakePropertiesDefinition {
  name: string
  properties: string
}

const getExpectPropertiesForSubDocumentArray = (interfaceProperties: string[], subDocumentName: string, collectionName: string): string => {
  const expectProperties: string[] = ['\n  for(let i = 0; i++; i < 3) {']

  interfaceProperties.forEach(prop => {
    const propName = prop.split(':')[0].trim().replace('?', '')
    const propType = prop.split(':')[1].trim()

    if (propName !== '_id') {
      switch (propType) {
        case 'Date':
          expectProperties.push(`    expect(new Date(response.body.${subDocumentName}[i].${propName})).toEqual(${collectionName}.${subDocumentName}[i].${propName})`)
          break
        case 'Date[]':
          expectProperties.push(
            `    expect(response.body.${subDocumentName}[i].${propName}.map(d => new Date(d))).toEqual(${collectionName}.${subDocumentName}[i].${propName})`
          )
          break
        default:
          expectProperties.push(`    expect(response.body.${subDocumentName}[i].${propName}).toEqual(${collectionName}.${subDocumentName}[i].${propName})`)
      }
    }
  })

  expectProperties.push('  }')

  return `${expectProperties.join('\n')}\n`
}

const getExpectPropertiesForSubDocument = (interfaceProperties: string[], subDocumentName: string, collectionName: string): string => {
  const expectProperties: string[] = []

  interfaceProperties.forEach(prop => {
    const propName = prop.split(':')[0].trim().replace('?', '')
    const propType = prop.split(':')[1].trim()

    if (propName !== '_id') {
      switch (propType) {
        case 'Date':
          expectProperties.push(`  expect(new Date(response.body.${subDocumentName}.${propName})).toEqual(${collectionName}.${subDocumentName}.${propName})`)
          break
        case 'Date[]':
          expectProperties.push(
            `  expect(response.body.${subDocumentName}.${propName}.map(d => new Date(d))).toEqual(${collectionName}.${subDocumentName}.${propName})`
          )
          break
        default:
          expectProperties.push(`  expect(response.body.${subDocumentName}.${propName}).toEqual(${collectionName}.${subDocumentName}.${propName})`)
      }
    }
  })

  return expectProperties.join('\n')
}

const getExpectProperties = (interfaceProperties: string[], interfaces: InterfaceDefinition[], collectionName: string): string => {
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
          const isArray = prop.includes('[]')
          const interfaceForSubDocument = isArray 
          ? interfaces.find(i => pluralize(i.name) === propName)?.properties
          : interfaces.find(i => i.name === propName)?.properties
          // check to see if the 'type' here is subDocument
          if (interfaceForSubDocument) {
            if (isArray) {
              expectProperties.push(getExpectPropertiesForSubDocumentArray(interfaceForSubDocument, propName, collectionName))
            } else {
              expectProperties.push(getExpectPropertiesForSubDocument(interfaceForSubDocument, propName, collectionName))
            }
          } else {
            expectProperties.push(`  expect(response.body.${propName}).toEqual(${collectionName}.${propName})`)
          }
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

const extractInterfaceProperties = (lines: string[]) => {
  let parentSchema
  let remainder

  const firstLineIndex = lines.findIndex(l => l.includes('export interface'))
  const parentAndDown = [...lines].splice(firstLineIndex, lines.length - firstLineIndex)
  const lastLineIndex = parentAndDown.findIndex(l => l === '}')

  // getting just the properties from the schema definition
  parentSchema = parentAndDown.splice(1, lastLineIndex - 1).map(l => l)

  return parentSchema
}

interface InterfaceDefinition {
  name: string
  properties: string[]
}

interface SubDocNameAndPath {
  name: string
  path: string
}

const getInterfaces = async (collectionName: string): Promise<InterfaceDefinition[]> => {
  const parentDocPath = `${process.cwd()}/src/interfaces/${collectionName}/${collectionName}-poto.ts`
  const parentDocument = await fileSystem.getArray(parentDocPath)
  const parentInterface = extractInterfaceProperties(parentDocument)
  const parentInterfaceDefinition: InterfaceDefinition = { name: 'parentInterface', properties: parentInterface }
  const subDocumentPaths: SubDocNameAndPath[] = []

  const files = fs.readdirSync(`${process.cwd()}/src/interfaces/${collectionName}/sub-documents`)
  files.forEach(function(file: string) {
    // file = 'branch-doc.ts' || file = "branch-poto.ts"
    if (file.includes('poto')) {
      const name = file.split('-')[0]
      subDocumentPaths.push({
        name,
        path: `${process.cwd()}/src/interfaces/${collectionName}/sub-documents/${file}`
      })
    }
  })

  const promises: any = []
  subDocumentPaths.forEach(sdp => promises.push(fileSystem.getArray(sdp.path)))
  const arraysOfStrings = await Promise.all(promises)
  const subDocInterfaces: InterfaceDefinition[] = subDocumentPaths.map((sdp, index) => {
    return {
      name: sdp.name,
      properties: extractInterfaceProperties(arraysOfStrings[index] as string[])
    }
  })

  return [parentInterfaceDefinition, ...subDocInterfaces]
}

const getTemplateData = async (collectionName: string): Promise<any> => {
  const collectionNamePlural = pluralize(collectionName)
  const collectionNamePluralPascalCase = strings.capitalizeFirstLetter(collectionNamePlural)
  const collectionNamePascalCase = strings.capitalizeFirstLetter(collectionName)

  const interfaces = await getInterfaces(collectionName)
  const fakeProperties = getFakePropertiesForInterface(interfaces[0].properties, interfaces)
  const expectProperties = getExpectProperties(interfaces[0].properties, interfaces, collectionName)
  const firstRequiredProperty = getFirstRequiredProperty(interfaces[0].properties, collectionName)
  const interfacePath = `${collectionName}/${collectionName}`

  return {
    collectionName,
    collectionNamePlural,
    collectionNamePascalCase,
    collectionNamePluralPascalCase,
    fakeProperties,
    expectProperties,
    firstRequiredProperty,
    interfacePath
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

export const addCollectionEndpointsForMultiSchema = async (collectionName: string): Promise<void> => {
  try {
    // we don't need to validate because add-collection-endpoints has done that
    // we don't need to create interfaces because add-collection-endpoints has done that

    const { root, sourceFolder, templateData, templates } = await initialize(collectionName)
    await addDynamicTemplates(root, templateData, templates, sourceFolder)
  } catch (e) {
    //@ts-ignore
    messages.handleError(e, 'add-collection-endpoints-for-multi-schema')
  }

  return
}

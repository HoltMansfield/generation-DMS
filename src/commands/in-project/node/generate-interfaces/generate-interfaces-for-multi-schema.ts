import messages from '../../../../logic/console-messages'
import fs from 'fs'
import fileSystem, { HoltoCliLine, Line } from '../../../../logic/file-system'
import strings from '../../../../logic/strings'
import { listeners } from 'process'
import { parse } from 'commander'
import { first } from 'lodash'

export interface MongooseSchema {
  name: string
  schema: string[]
}

const getType = (text: string): string => {
  if (text.includes('}')) {
    const fieldSpec = text.split(':')[2]
    const noBraces = fieldSpec.replace('{', '').replace('}', '')
    const type = noBraces.split(',')[0]

    return type.trim()
  }

  // syntax is of type => name: String,
  const noComma = text.replace(',', '')
  //messages.info(`no comma: ${noComma}`)
  // name: String
  const typeOnly = noComma.split(':')[1].trim()

  return typeOnly
}

interface Test {
  x: string
  y: number
  d: Date
  b: boolean
}

const mapProperty = (line: string, subDocumentTypes: string[], subDocumentExtension: string): string => {
  const propName = line.split(':')[0].trim()
  const requiredFlag = line.includes('required') ? '' : '?'
  const type = getType(line)

  switch (type) {
    case 'String':
      return `  ${propName}${requiredFlag}: string`
    case 'Number':
      return `  ${propName}${requiredFlag}: number`
    case 'Boolean':
      return `  ${propName}${requiredFlag}: boolean`
    case 'Date':
      return `  ${propName}${requiredFlag}: Date`
    case '[String]':
      return `  ${propName}${requiredFlag}: string[]`
    case '[Number]':
      return `  ${propName}${requiredFlag}: number[]`
    case '[Date]':
      return `  ${propName}${requiredFlag}: Date[]`
    case '[Boolean]':
      return `  ${propName}${requiredFlag}: boolean[]`
    default:
      const typeWithoutBrackets = type.replace('[', '').replace(']', '')
      if (!subDocumentTypes.includes(typeWithoutBrackets)) {
        throw new Error(`TS Type not found for ${type}`)
      }

      if (type.includes('[')) {
        return `  ${propName}${requiredFlag}: ${strings.capitalizeFirstLetter(
          typeWithoutBrackets
        )}${subDocumentExtension}[]`
      }

      return `  ${propName}${requiredFlag}: ${strings.capitalizeFirstLetter(
        typeWithoutBrackets
      )}${subDocumentExtension}`
  }
}

const writeInterfaceFromMongooseSchema = async (
  schema: MongooseSchema,
  subPath: string,
  subDocumentTypes?: string[]
): Promise<boolean> => {
  const collectionNamePascalCase = strings.capitalizeFirstLetter(schema.name)
  const tsDocProps = schema.schema.map(i => mapProperty(i, subDocumentTypes || [], ''))
  const tsPotoProps = schema.schema.map(i => mapProperty(i, subDocumentTypes || [], ''))

  const imports =
    "import { Document } from 'mongoose'\rimport { ObjectId } from 'mongo'\r\nimport { MongoResult } from 'interfaces/holto-cli/mongo-result'"
  const docInterfaceSignature = `export interface ${collectionNamePascalCase}Doc extends Document, MongoResult {`
  const potoInterfaceSignature = `export interface ${collectionNamePascalCase} {`
  const defaultDocIdProp = '  _id: ObjectId'
  const defaultPotoIdProp = '  _id?: string'
  const closingBrace = '}'

  // prepare a Doc interface
  const subDocumentImportsForDoc = subDocumentTypes
    ? subDocumentTypes.map(
          // subDocType =>
          //   `import { ${strings.capitalizeFirstLetter(subDocType)}Doc } from './sub-documents/${subDocType}-doc'\r`
          subDocType =>
          `import { ${strings.capitalizeFirstLetter(subDocType)} } from './sub-documents/${subDocType}-poto'\r`
        )
      .join('\n')
    : null
  const newDocInterface = subDocumentImportsForDoc
    ? [imports, subDocumentImportsForDoc + '\n', docInterfaceSignature, defaultDocIdProp, ...tsDocProps, closingBrace]
    : [imports + '\r\n', docInterfaceSignature, defaultDocIdProp, ...tsDocProps, closingBrace]
  const docText = newDocInterface.map(line => line)
  const docData = docText.join('\n') + '\n'
  const docDestinationPath = `${process.cwd()}/src/interfaces/${subPath}/${schema.name}-doc.ts`

  // prepare a POTO interface
  const subDocumentImportsForPoto = subDocumentTypes
    ? subDocumentTypes.map(
        subDocType =>
          `import { ${strings.capitalizeFirstLetter(subDocType)} } from './sub-documents/${subDocType}-poto'\r`
      )
      .join('\n')
    : null
  const newPotoInterface = subDocumentImportsForPoto
    ? [subDocumentImportsForPoto + '\n', potoInterfaceSignature, defaultPotoIdProp, ...tsPotoProps, closingBrace]
    : [potoInterfaceSignature, defaultPotoIdProp, ...tsPotoProps, closingBrace]
  const potoText = newPotoInterface.map(line => line)
  const potoData = potoText.join('\n') + '\n'
  const potoDestinationPath = `${process.cwd()}/src/interfaces/${subPath}/${schema.name}-poto.ts`

  try {
    if(subDocumentTypes !== undefined) await fileSystem.writeFile(docDestinationPath, docData)
    await fileSystem.writeFile(potoDestinationPath, potoData)
  } catch (e) {
    messages.handleError(e, 'processModel')
  }
  messages.success(`added interface: ${docDestinationPath}`)

  return true
}

const parseSchemas = (lines: HoltoCliLine[], schemas: MongooseSchema[]) => {
  const name = lines[0].text.split(' ')[1]
  const indexOfEndingSchema = lines.findIndex(l => l.text.includes('})'))
  const schema = lines.splice(1, indexOfEndingSchema - 1)

  schemas.push({
    name,
    schema: schema.map(l => l.text)
  })

  const remainder = lines.splice(indexOfEndingSchema)

  if (remainder?.length) {
    // continue to chop this down
    return parseSchemas(remainder, schemas)
  }

  return schemas
}

const parseParentSchema = (lines: HoltoCliLine[]) => {
  let parentSchema
  let remainder

  const firstLineIndex = lines.findIndex(l => l.text === 'const compiledSchema = new Schema({')
  const parentAndDown = [...lines].splice(firstLineIndex, lines.length - firstLineIndex)
  const lastLineIndex = parentAndDown.findIndex(l => l.text === '})')

  // the remaining schemas are all below the parent schema
  remainder = [...lines].splice(0, firstLineIndex)
  // trim remainder from boilerplate lines to get just the child schemas
  remainder = remainder.splice(3, remainder.length - 3)

  // getting just the properties from the schema definition
  parentSchema = parentAndDown.splice(1, lastLineIndex - 1).map(l => l.text)

  return { parentSchema, remainder }
}

// this command is run from the root of a node API with mongoose schemas
export const generateMultipleInterfaces = async (collectionName: string, lines: HoltoCliLine[], projectName: string): Promise<void> => {
  try {
    const { parentSchema, remainder } = parseParentSchema(lines)
    const schemas = parseSchemas(remainder, [])
    const subDocumentTypes = schemas.map(s => s.name)

    const root = `${process.cwd()}`
    await fileSystem.makeDirectory(`${root}/src/interfaces/${collectionName}`)
    await fileSystem.makeDirectory(`${root}/src/interfaces/${collectionName}/sub-documents`)

    writeInterfaceFromMongooseSchema({ schema: parentSchema, name: collectionName }, collectionName, subDocumentTypes)
    schemas.forEach(schema => writeInterfaceFromMongooseSchema(schema, `${collectionName}/sub-documents`, undefined))
  } catch (e) {
    messages.handleError(e, 'generatePotos')
  }

  return
}

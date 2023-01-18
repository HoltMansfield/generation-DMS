import messages from '../../../../logic/console-messages'
import fs from 'fs'
import path from 'path'
import fileSystem, { Line } from '../../../../logic/file-system'
import strings from '../../../../logic/strings'
import { generateMultipleInterfaces } from './generate-interfaces-for-multi-schema'
import { generateSingleInterface } from './generate-single-interface'

// const getType = (text: string): string => {
//   if (text.includes('}')) {
//     const fieldSpec = text.split(':')[2]
//     const noBraces = fieldSpec.replace('{', '').replace('}', '')
//     const type = noBraces.split(',')[0]

//     return type.trim()
//   }

//   // syntax is of type => name: String,
//   const noComma = text.replace(',', '')
//   //messages.info(`no comma: ${noComma}`)
//   // name: String
//   const typeOnly = noComma.split(':')[1].trim()

//   return typeOnly
// }

// interface Test {
//   x: string
//   y: number
//   d: Date
//   b: boolean
// }

// const mapProperty = (line: Line): Line => {
//   const text = line.text
//   const propName = text.split(':')[0].trim()
//   const requiredFlag = text.includes('required') ? '' : '?'
//   const type = getType(text)

//   switch (type) {
//     case 'String':
//       return { text: `  ${propName}${requiredFlag}: string` }
//     case 'Number':
//       return { text: `  ${propName}${requiredFlag}: number` }
//     case 'Boolean':
//       return { text: `  ${propName}${requiredFlag}: boolean` }
//     case 'Date':
//       return { text: `  ${propName}${requiredFlag}: Date` }
//     case '[String]':
//       return { text: `  ${propName}${requiredFlag}: string[]` }
//     case '[Number]':
//       return { text: `  ${propName}${requiredFlag}: number[]` }
//     case '[Date]':
//       return { text: `  ${propName}${requiredFlag}: Date[]` }
//     case '[Boolean]':
//       return { text: `  ${propName}${requiredFlag}: boolean[]` }
//     default:
//       throw new Error(`TS Type not found for ${type}`)
//   }
// }

// const extractSchema = (lines: Line[]): Line[] => {
//   const firstLineIndex = lines.findIndex(l => l.text === 'const compiledSchema = new Schema({')
//   const lastLineIndex = lines.splice(0, firstLineIndex).findIndex(l => l.text === '}')

//   // all we want are the properties
//   return lines.splice(firstLineIndex + 1, lastLineIndex - firstLineIndex - 1)
// }

// const processModel = async (rootPath: string, fileName: string): Promise<boolean> => {
//   const lines = await fileSystem.getLines(rootPath)
//   const schema = extractSchema(lines)
//   const tsProps = schema.map(l => mapProperty(l))
//   const fileNamePascalCase = strings.capitalizeFirstLetter(fileName)

//   const imports = {
//     text:
//       "import { Document } from 'mongoose'\rimport { ObjectId } from 'mongo'\r\nimport { MongoResult } from './holto-cli/mongo-result'\r\n"
//   }
//   const docInterfaceSignature = {
//     text: `export interface ${fileNamePascalCase.split('.')[0]}Doc extends Document, MongoResult {`
//   }
//   const potoInterfaceSignature = {
//     text: `export interface ${fileNamePascalCase.split('.')[0]} {`
//   }
//   const defaultDocIdProp = {
//     text: '  _id: ObjectId'
//   }
//   const defaultPotoIdProp = {
//     text: '  _id?: string'
//   }
//   const closingBrace = {
//     text: '}'
//   }

//   // prepare a Doc interface
//   const newDocInterface = [imports, docInterfaceSignature, defaultDocIdProp, ...tsProps, closingBrace]
//   const docText = newDocInterface.map(line => line.text)
//   const docData = docText.join('\n') + '\n'
//   const docDestinationPath = `${process.cwd()}/src/interfaces/${fileName.split('.')[0]}-doc.ts`

//   // prepare a POTO interface
//   const newPotoInterface = [potoInterfaceSignature, defaultPotoIdProp, ...tsProps, closingBrace]
//   const potoText = newPotoInterface.map(line => line.text)
//   const potoData = potoText.join('\n') + '\n'
//   const potoDestinationPath = `${process.cwd()}/src/interfaces/${fileName.split('.')[0]}-poto.ts`

//   try {
//     await fileSystem.writeFile(docDestinationPath, docData)
//     await fileSystem.writeFile(potoDestinationPath, potoData)
//   } catch (e) {
//     //@ts-expect-error
//     messages.handleError(e, 'processModel')
//   }
//   messages.success(`added interface: ${docDestinationPath}`)

//   return true
// }

// const processModels = async (rootPath: string): Promise<boolean> => {
//   const promises: Promise<any>[] = []

//   fs.readdirSync(rootPath).filter(file => promises.push(processModel(`${rootPath}/${file}`, file)))
//   await Promise.all(promises)

//   return true
// }

const countSchemas = (lines: any[]) => {
  const count = lines.filter(x => {
    return x.text.includes('new Schema({')
  }).length
  return count
}

// this command is run from the root of a node API with mongoose schemas
export const generateInterface = async (collectionName: string): Promise<void> => {
  try {
    const projectName = path.basename(path.dirname(`${process.cwd()}/package.json`))
    const collectionPath = `${process.cwd()}/src/data/collections/${collectionName}.ts`
    const lines = await fileSystem.getLines(collectionPath)
    const numberOfSchemas = countSchemas(lines)

    if (numberOfSchemas > 1) {
      generateMultipleInterfaces(collectionName, lines, projectName)
    } else {
      generateSingleInterface(collectionName, projectName)
    }
  } catch (e) {
    //@ts-ignore
    messages.handleError(e, 'generatePotos')
  }

  return
}

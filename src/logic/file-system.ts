const fs = require('fs').promises
import fsOG from 'fs'
import fsEXTRA from 'node-fs-extra'
import lineReader from 'line-reader'
import messages from '../logic/console-messages'
import { find } from 'ramda'

export interface Line {
  text: string
}

const deleteFile = async (path: string): Promise<void> => {
  try {
    return await fs.unlink(path)
  } catch (e) {
    // die silently
    return
  }
}

const writeFile = (destinationPath: string, content: string): Promise<void> => {
  return fs.writeFile(destinationPath, content)
}

const readFile = (path: string) => {
  return fs.readFile(path)
}

const readFileIntoString = (path: string) => {
  return fs.readFile(path, 'utf8')
}

const makeDirectory = (path: string) => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    fsOG.mkdir(path, { recursive: true }, (err: Error) => {
      if (err) {
        reject(err)
      }

      resolve(path)
    })
  })
}

// If the parent directory does not exist, it's created
const outputFile = (path: string, data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fsEXTRA.outputFile(path, data, (err: Error) => {
      if (err) {
        reject(err)
      }

      resolve(path)
    })
  })
}

// If the parent directory does not exist, it's created
const outputArrayToFile = (path: string, data: string[]): Promise<string> => {
  const fileData = data.join('\r\n')
  return new Promise((resolve, reject) => {
    fsEXTRA.outputFile(path, fileData, (err: Error) => {
      if (err) {
        reject(err)
      }

      resolve(path)
    })
  })
}

export interface HoltoCliLine {
  text: string
}

// takes a path and returns array of [{ text: line},...]
const getLines = (path: string): Promise<HoltoCliLine[]> => {
  const doesFileExist = fsOG.existsSync(path)

  if (!doesFileExist) {
    throw new Error(`Holto-cli file-system.getLines(): Path does not exist => ${path}`)
  }

  return new Promise(resolve => {
    const data: Line[] = []
    //@ts-ignore
    lineReader.eachLine(path, function(line: string, last: boolean) {
      data.push({
        text: line
      })

      if (last) {
        resolve(data)
      }
    })
  })
}

const getArray = (path: string): Promise<string[]> => {
  return new Promise(resolve => {
    const data: string[] = []
    //@ts-ignore
    lineReader.eachLine(path, function(line: string, last: boolean) {
      data.push(line)

      if (last) {
        resolve(data)
      }
    })
  })
}

const insertAtTag = (lines: any[], tag: string, text: string): void => {
  const newLine = {
    text
  }
  const insertIndex = lines.findIndex(line => line.tag === tag)
  lines.splice(insertIndex, 0, newLine)
}

const tagLine = (lines: any[], tag: string, condition: string, relationToCondition: number): void => {
  const indexOf = lines.findIndex(line => line.text.trim() === condition)
  lines[indexOf + relationToCondition] = {
    tag,
    text: lines[indexOf + relationToCondition].text
  }
}

const alphabetizeExports = (lines: any[]): void => {
  const startIndex = lines.findIndex(line => line.tag === 'start')
  const endIndex = lines.findIndex(line => line.tag === 'end')
  const numberOfLines = endIndex - startIndex + 1
  const linesToSort = lines.splice(startIndex, numberOfLines)
  let mapped = linesToSort.map(line => line.text.trim())
  mapped.sort()
  // filter out any empty lines
  mapped = mapped.filter(x => x.length)
  const mappedBack = mapped.map(text => ({ tag: 'alpha', text: `\t${text}` }))
  lines.splice(startIndex, 0, ...mappedBack)
}

const alphabetizeImports = (lines: any[], leading: string): void => {
  const startIndex = lines.findIndex(line => line.text.indexOf('import/prefer-default-export') !== -1)
  const endIndex = lines.findIndex(line => line.text.trim().length === 0)
  const numberOfLines = endIndex - startIndex
  const linesToSort = lines.splice(startIndex, numberOfLines)

  const mapped = linesToSort.map(line => {
    const withoutLeadingSegment = line.text.replace(leading, '')
    const importName = withoutLeadingSegment.split(' ')[0]

    return {
      ...line,
      // create a mapping so we can reconcile after sorting
      shortText: importName
    }
  })
  // an array with just strings is sortable
  let sortable = mapped.map(line => line.shortText)
  sortable.sort()
  // filter out any empty lines
  sortable = sortable.filter(x => x.length)
  const sorted = []

  // now we have one array of just strings that is sorted
  // create a new array with data from mapped in the order of sortable
  for (const importName of sortable) {
    const nextImport = mapped.find(line => {
      return line.shortText === importName
    })
    //@ts-ignore
    sorted.push(nextImport)
  }
  lines.splice(0, 0, ...sorted)
}

/* eslint max-statements: "off" */
const alphabetizeReducerImports = (lines: any[], leading: string): void => {
  let startIndex = lines.findIndex(line => line.text.indexOf('// reducers') !== -1)
  let endIndex = lines.findIndex(line => line.text.indexOf('// end of reducers from this project') !== -1)
  // add one to get the next line
  startIndex++
  // subtract one to get the previous line
  endIndex--
  const numberOfLines = endIndex - startIndex + 1
  const linesToSort = lines.splice(startIndex, numberOfLines)

  const mapped = linesToSort.map(line => {
    const withoutLeadingSegment = line.text.replace(leading, '')
    const importName = withoutLeadingSegment.split(' ')[0]

    return {
      ...line,
      // create a mapping so we can reconcile after sorting
      shortText: importName
    }
  })

  // an array with just strings is sortable
  let sortable = mapped.map(line => line.shortText)
  // filter out any empty lines
  sortable = sortable.filter(x => x.length)
  sortable.sort()
  const sorted = []

  // now we have one array of just strings that is sorted
  // create a new array with data from mapped in the order of sortable
  for (const importName of sortable) {
    const nextImport = mapped.find(line => {
      return line.shortText === importName
    })
    if (nextImport) {
      //@ts-ignore
      sorted.push(nextImport)
    }
  }
  lines.splice(startIndex, 0, ...sorted)
}

const insertBelowGeneratorTag = (lines: any[], generatorToken: string, newText: string): void => {
  const index = lines.findIndex(line => line.text.includes(generatorToken))
  // insert AFTER found index and thus BELOW
  lines.splice(index + 1, 0, {
    tag: generatorToken,
    text: newText
  })
}

const insertInFirstBlankLine = (lines: any[], newText: string): void => {
  const index = lines.findIndex(line => line.text.length === 0)
  // insert AFTER found index and thus BELOW
  lines.splice(index, 0, {
    tag: 'insertInFirstBlankLine',
    text: newText
  })
}

const appendLine = (lines: any[], newText: string): void => {
  lines.push({
    tag: 'insertInFirstBlankLine',
    text: newText
  })
}

const insertAboveGeneratorTag = (lines: any[], generatorToken: string, newText: string): void => {
  const index = lines.findIndex(line => line.text.includes(generatorToken))
  // insert AFTER found index and thus BELOW
  lines.splice(index, 0, {
    tag: generatorToken,
    text: newText
  })
}

const insertAtGeneratorTag = (lines: any[], generatorToken: string, newText: string): void => {
  const index = lines.findIndex(line => line.text.indexOf(generatorToken) !== -1)
  // overwrite the line that has the token with new object
  lines[index] = {
    tag: generatorToken,
    text: newText
  }
}

// const replaceToken = (lines, token, newText) => {
//   const oldText = lines.find(line => line.text.indexOf(token) !== -1).text
// }

const getSourceFolder = (dirName: string): string => {
  // our code is transpiled into 'dist' folder but our templates are in src
  return dirName.replace('dist', 'src')
}

const exists = (path: string): boolean => {
  return fsOG.existsSync(path)
}

export default {
  deleteFile,
  writeFile,
  readFile,
  readFileIntoString,
  makeDirectory,
  outputFile,
  outputArrayToFile,
  getLines,
  getArray,
  insertAtTag,
  alphabetizeExports,
  tagLine,
  alphabetizeImports,
  alphabetizeReducerImports,
  insertBelowGeneratorTag,
  insertInFirstBlankLine,
  appendLine,
  insertAboveGeneratorTag,
  insertAtGeneratorTag,
  getSourceFolder,
  exists
}

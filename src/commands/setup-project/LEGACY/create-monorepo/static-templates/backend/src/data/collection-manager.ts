import fs from 'fs'
import mongoose from 'mongoose'
import pluralize from 'pluralize'

let _collectionsImported = false

const createCollection = (file: string): void => {
  const modelName = file.replace('.ts', '')
  const modulePath = './collections/' + modelName

  // require in the module for this collection
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { compiledSchema } = require(modulePath)

  // check with mongoose if the schema has already been registered
  if (!mongoose.models[modelName]) {
    // map to plural form
    const modelNamePlural = pluralize(modelName)
    // register the schema with mongoose
    mongoose.model(modelNamePlural, compiledSchema)
  }
}

export const importCollections = (): void => {
  if (!_collectionsImported) {
    const srcpath = __dirname + '/collections'

    fs.readdirSync(srcpath).filter((file) => createCollection(file))
    if (process.env.NODE_ENV !== 'e2e') {
      console.log('Mongo collections imported')
    }
    _collectionsImported = true
  }
}

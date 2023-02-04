import { Express } from 'express'
import { serializeError } from 'serialize-error'
import { connectToDb } from './db-connection'
import {
  setupApp,
  addPreRoutesMiddleware,
  addPostRoutesMiddleware,
  setupRouting,
  startListening
} from './setup-express'

let app = null
let httpServer

export const getExpressApp = async (): Promise<Express> => {
  if (app) {
    return app
  }

  try {
    // connect to mongo
    await connectToDb()

    // create the express app
    app = setupApp()

    // some middleware must be added before routes are added
    addPreRoutesMiddleware(app)

    // add all routes in the controllers folder
    setupRouting(app)

    // some middleware must be added after routes are added
    addPostRoutesMiddleware(app)

    // start the actual http listener
    httpServer = startListening(app)

    return app
  } catch (error) {
    console.log(`an error occurred while starting: ${JSON.stringify(serializeError(error))}`)
  }
}

export const closeServer = async (): Promise<void> => {
  return httpServer.close()
}
  
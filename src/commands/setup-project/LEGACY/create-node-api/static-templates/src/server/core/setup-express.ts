import express, { Express } from 'express'
import glob from 'glob'
import path from 'path'
import bodyParser from 'body-parser'
import expressJwt from 'express-jwt'
import morgan from 'morgan'
import { handleApiError } from '../error-handling/error-handling-middleware'

const port: number = process.env.PORT ? Number(process.env.PORT) : 4000

export const setupApp = (): Express => {
  const app = express()

  return app
}

export const startListening = (app: Express): any => {
  const server = app.listen(port, () => {
    if (process.env.NODE_ENV !== 'e2e') {
      console.log(`server is listening on ${port}`)
    }
    return true
  })

  // ToDo
  server.on('error', function(err) {})

  return server
}

export const setupRouting = (app: Express): Express => {
  glob.sync('./src/server/controllers/*.*').forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const module = require(path.resolve(file))
    module.addRoutes(app)
  })

  return app
}

// some middleware must be added before routes are added
export const addPreRoutesMiddleware = (app: Express): Express => {
  // parse application/json
  app.use(bodyParser.json())

  if (process.env.NODE_ENV !== 'e2e') {
    app.use(morgan('combined'))
  }

  // parse all urls for JWT except routes included in 'path' below
  app.use(
    expressJwt({ secret: 'toDo: use cert' }).unless({
      path: [
        // a user who is not logged in needs to be able to create an account
        { url: '/users', methods: ['POST'] },
        // the actual login endpoint
        { url: '/users/authenticate', methods: ['POST'] },
        // a simple test url
        { url: '/heartbeat', methods: ['GET'] }
      ]
    })
  )

  return app
}

// some middleware must be added afer routes are added
export const addPostRoutesMiddleware = (app: Express): Express => {
  app.use(handleApiError)

  return app
}

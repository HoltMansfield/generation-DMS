import { Express } from 'express'

export const addRoutes = (app: Express): Express => {
  app.get('/heartbeat', (req, res) => {
    const stamp = new Date().toString()
    const nodeEnv = process.env.NODE_ENV

    res.send(`Node is running ${stamp}.
      We are currently running in nodeEnv: ${nodeEnv}`)
  })

  return app
}

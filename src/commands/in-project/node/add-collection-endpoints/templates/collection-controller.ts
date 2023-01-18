import { Express } from 'express'
import { getById, find, create, update, destroy } from '../../logic/<%= collectionNamePlural %>-logic'
import { <%= collectionNamePascalCase %> } from '@<%= projectName %>/data-model'

export const addRoutes = (app: Express): Express => {
  app.get('/<%= collectionNamePlural %>/:id', async (req, res, next) => {
    try {
      const <%= collectionNamePlural %>: <%= collectionNamePascalCase %>[] = await getById(req.params.id)
      return res.json(<%= collectionNamePlural %>)
    } catch (err) {
      next(err)
    }
  })

  app.post('/<%= collectionNamePlural %>/find', async (req, res, next) => {
    try {
      const <%= collectionNamePlural %>: <%= collectionNamePascalCase %>[] = await find(req.body)
      return res.json(<%= collectionNamePlural %>)
    } catch (err) {
      next(err)
    }
  })

  app.post('/<%= collectionNamePlural %>', async (req, res, next) => {
    try {
      const data: <%= collectionNamePascalCase %> = await create(req.body)
      return res.json(data)
    } catch (err) {
      next(err)
    }
  })

  app.put('/<%= collectionNamePlural %>', async (req, res, next) => {
    try {
      const data: <%= collectionNamePascalCase %> = await update(req.body)
      return res.json(data)
    } catch (err) {
      next(err)
    }
  })

  app.delete('/<%= collectionNamePlural %>', async (req, res, next) => {
    try {
      const data: <%= collectionNamePascalCase %> = await destroy(req.body)
      return res.json(data)
    } catch (err) {
      next(err)
    }
  })

  return app
}

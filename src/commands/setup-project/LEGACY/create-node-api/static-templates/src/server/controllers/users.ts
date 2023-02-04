import { Express } from 'express'
import jwt from 'jsonwebtoken'
import { getById, find, create, update, destroy, authenticate } from '../../logic/users-logic'
import { User } from 'interfaces/User-poto'

export const addRoutes = (app: Express): Express => {
  app.get('/users/:id', async (req, res, next) => {
    try {
      const users: User[] = await getById(req.params.id)
      return res.json(users)
    } catch (err) {
      next(err)
    }
  })

  app.post('/users/authenticate', async (req, res, next) => {
    try {
      const user: User = await authenticate(req.body)
      // remove the password and salt so it's safe to send out over the wire
      delete user.password
      delete user.salt

      const token = jwt.sign(user, 'toDo: use cert')

      return res.json({ user, jwt: token })
    } catch (err) {
      next(err)
    }
  })

  app.post('/users/find', async (req, res, next) => {
    try {
      const users: User[] = await find(req.body)
      return res.json(users)
    } catch (err) {
      next(err)
    }
  })

  app.post('/users', async (req, res, next) => {
    try {
      const user: User = await create(req.body)
      // remove the password and salt so it's safe to send out over the wire
      delete user.password
      delete user.salt

      const token = jwt.sign(user, 'toDo: use cert')

      return res.json({
        user,
        jwt: token
      })
    } catch (err) {
      next(err)
    }
  })

  app.put('/users', async (req, res, next) => {
    try {
      const data: User = await update(req.body)
      return res.json(data)
    } catch (err) {
      next(err)
    }
  })

  app.delete('/users', async (req, res, next) => {
    try {
      const user: User = await destroy(req.body)
      return res.json(user)
    } catch (err) {
      next(err)
    }
  })

  return app
}

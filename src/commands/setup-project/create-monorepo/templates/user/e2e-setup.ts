import defaults from 'superagent-defaults'
import supertest from 'supertest'
import { getExpressApp, closeServer } from '../core/get-express-app'
import { closeConnection } from '../core/db-connection'
import { getE2EJwt } from './get-e2e-jwt'
import { User } from '@<%= projectName %>/data-model'

export interface E2ERequest {
  get(url: string): any
  put(url: string): any
  post(url: string): any
  delete(url: string): any
}

export interface E2ETextContext {
  user: User
  jwt: string
  request: E2ERequest
}

export const setupTest = async (): Promise<E2ETextContext> => {
  const server = await getExpressApp()
  const { jwt, user } = await getE2EJwt(supertest, server)
  const request = defaults(supertest(server))
  request.set({ Authorization: `Bearer ${jwt}` })

  return { request, jwt, user }
}

export const tearDownTest = async (): Promise<void> => {
  await closeConnection()
  await closeServer()

  return
}

import { User } from '@<%= projectName %>/data-model'

export interface NewUserResponse {
  user: User
  jwt: string
}

export const getE2EJwt = async (request: any, server: any): Promise<NewUserResponse> => {
  const response = await request(server)
    .post('/users')
    .send({ userName: 'PSkillz', email: 'PascalSiakim@gmail.com', password: 'butta' })

  if (!response.body.jwt) {
    throw new Error('Error in get-e2e-jwt - E2E Login has failed')
  }

  return response.body
}

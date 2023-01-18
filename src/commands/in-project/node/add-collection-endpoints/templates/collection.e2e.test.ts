import { setupTest, tearDownTest } from './e2e-setup'
import { <%= collectionNamePascalCase %> } from '@<%= projectName %>/data-model'
import fakerFactory from './test-data/fakerFactory'

let request

const getFake<%= collectionNamePascalCase %> = (): <%= collectionNamePascalCase %> => ({
<%= fakeProperties %>
})

const post<%= collectionNamePascalCase %> = async (): Promise<any> => {
  const new<%= collectionNamePascalCase %>: <%= collectionNamePascalCase %> = getFake<%= collectionNamePascalCase %>()
  return await request.post('/<%= collectionNamePlural %>').send(new<%= collectionNamePascalCase %>)
}

beforeAll(async () => {
  const result = await setupTest()
  request = result.request
})

afterAll(async () => {
  await tearDownTest()
})

test('should POST a <%= collectionName %>', async (done) => {
  const <%= collectionName %>: <%= collectionNamePascalCase %> = getFake<%= collectionNamePascalCase %>()
  const response = await request.post('/<%= collectionNamePlural %>').send(<%= collectionName %>)

  expect(response.status).toBe(200)
  expect(response.body._id).toBeDefined()
<%= expectProperties %>
  done()
})

test('should GET a <%= collectionName %> by ID', async (done) => {
  const new<%= collectionNamePascalCase %>Response = await post<%= collectionNamePascalCase %>()
  const <%= collectionName %>: <%= collectionNamePascalCase %> = new<%= collectionNamePascalCase %>Response.body

  const response = await request.get(`/<%= collectionNamePlural %>/${<%= collectionName %>._id}`)
  expect(response.status).toBe(200)
  done()
})

test('should PUT a <%= collectionName %>', async (done) => {
  // create a test <%= collectionName %>
  const new<%= collectionNamePascalCase %>Response = await post<%= collectionNamePascalCase %>()
  const <%= collectionName %>: <%= collectionNamePascalCase %> = new<%= collectionNamePascalCase %>Response.body
  <%= collectionName %>.<%= firstRequiredProperty %> = fakerFactory.getString()

  // call the API to update
  const putResponse = await request.put(`/<%= collectionNamePlural %>`).send(<%= collectionName %>)
  expect(putResponse.status).toBe(200)

  // fetch it back from the API to verify
  const getResponse = await request.get(`/<%= collectionNamePlural %>/${<%= collectionName %>._id}`)
  expect(getResponse.status).toBe(200)
  expect(getResponse.body.<%= firstRequiredProperty %>).toEqual(<%= collectionName %>.<%= firstRequiredProperty %>)

  done()
})

test('should find a <%= collectionName %>', async (done) => {
  const new<%= collectionNamePascalCase %>Response = await post<%= collectionNamePascalCase %>()
  const <%= collectionName %>: <%= collectionNamePascalCase %> = new<%= collectionNamePascalCase %>Response.body

  const putResponse = await request.post(`/<%= collectionNamePlural %>/find`).send({ _id: <%= collectionName %>._id })
  expect(putResponse.status).toBe(200)

  done()
})

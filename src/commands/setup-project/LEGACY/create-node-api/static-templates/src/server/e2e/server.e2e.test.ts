import { setupTest, tearDownTest } from './e2e-setup'

let request

beforeAll(async () => {
  const result = await setupTest()
  request = result.request
})

afterAll(async () => {
  await tearDownTest()
})

test('should have a heartbeat', async (done) => {
  const response = await request.get('/heartbeat')

  expect(response.status).toBe(200)
  done()
})

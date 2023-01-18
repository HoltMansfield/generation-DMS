import td from 'testdouble'

// setup our testdoubles BEFORE we require in the test subject
const { connectToDb } = td.replace('./server/core/connect-to-db')
const { setupApp, addPreRoutesMiddleware, addPostRoutesMiddleware, setupRouting, startListening } = td.replace(
  './server/core/setup-express'
)

// WE MUST USE REQUIRE FOR TEST SUBJECTS
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { run } = require('./app')

test('run method calls all expected startup methods', async () => {
  const mockExpressApp = { name: 'express' }
  td.when(setupApp()).thenReturn(mockExpressApp)

  await run()

  td.verify(connectToDb())
  td.verify(addPreRoutesMiddleware(mockExpressApp))
  td.verify(setupRouting(mockExpressApp))
  td.verify(addPostRoutesMiddleware(mockExpressApp))
  td.verify(startListening(mockExpressApp))
})

import td from 'testdouble'

// setup our testdoubles BEFORE we require in the test subject
const express = td.func()
td.replace('express', express)

const json = td.func()
td.replace('body-parser', { json })

const handleApiError = td.func()
td.replace('@finaeo/node-core', { handleApiError })

// WE MUST USE REQUIRE FOR TEST SUBJECTS
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { setupApp, startListening, addPreRoutesMiddleware, addPostRoutesMiddleware } = require('./setup-express')

test('setupApp creates an instance of express', () => {
  setupApp()

  td.verify(express())
})

test('addPreRoutesMiddleware wires up expected middleware', () => {
  const expectedBodyParserResponse = { response: 'All your JSON belongs to me' }
  td.when(json()).thenReturn(expectedBodyParserResponse)
  const use = td.func()
  const mockExpress = {
    use
  }
  addPreRoutesMiddleware(mockExpress)

  td.verify(use(expectedBodyParserResponse))
})

test('addPostRoutesMiddleware wires up expected middleware', () => {
  const use = td.func()
  const mockExpress = {
    use
  }
  addPostRoutesMiddleware(mockExpress)

  td.verify(use(handleApiError))
})

test('startListening creates an instance of express', () => {
  const listen = td.func()
  const mockExpress = {
    listen
  }
  startListening(mockExpress)

  td.verify(listen(3000, td.matchers.isA(Function)))
})

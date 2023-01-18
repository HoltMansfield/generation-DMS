import td from 'testdouble'
import { Response } from 'express'
import { ErrorAwareRequest } from './error-handling-middleware'

// set up doubles BEFORE we require in the test subject
const { serializeError } = td.replace('serialize-error')

// WE MUST USE REQUIRE FOR TEST SUBJECTS
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { handleApiError } = require('./error-handling-middleware')

beforeEach(() => {
  // setup a handler for the tests that aren't concerned with the error
  td.when(serializeError(null)).thenReturn(null)
})

test('handleApiError sets expected default status code', () => {
  const req = td.object<ErrorAwareRequest>()
  const res = td.object<Response>()

  // nulling this out to test default behaviour
  // req.statusCode = null

  handleApiError(null, req, res, null)

  td.verify(res.status(422))
  td.verify(res.send('{"statusCode":422,"error":"null"}'))
})

test('handleApiError sets provided status code', () => {
  const req = td.object<ErrorAwareRequest>()
  const res = td.object<Response>()

  req.statusCode = 500

  handleApiError(null, req, res, null)

  td.verify(res.status(500))
  td.verify(res.send('{"statusCode":500,"error":"null"}'))
})

test('handleApiError sets expected default message', () => {
  const req = td.object<ErrorAwareRequest>()
  const res = td.object<Response>()

  // nulling this out to test default behaviour
  // req.message = null

  handleApiError(null, req, res, null)

  td.verify(
    res.send(
      '{"message":"An error has occurred please try again","error":"null"}',
    ),
  )
})

test('handleApiError sets provided message', () => {
  const req = td.object<ErrorAwareRequest>()
  const res = td.object<Response>()
  const providedMessage = 'Flux Capacitor temp is critical'

  // nulling this out to test default behaviour
  req.message = providedMessage

  handleApiError(null, req, res, null)

  td.verify(res.send(`{"message":"${providedMessage}","error":"null"}`))
})

test('handleApiError serialized provided error', () => {
  const req = td.object<ErrorAwareRequest>()
  const res = td.object<Response>()
  const contrivedErrorString = 'Contrived Error'
  const expectedError = new Error(contrivedErrorString)

  // if we allow serializeError to do it's thing we get a stack trace that includes home directories which makes assertions impossible
  td.when(serializeError(expectedError)).thenReturn(contrivedErrorString)

  handleApiError(expectedError, req, res, null)

  td.verify(res.send(`{\"error\":\"\\"${contrivedErrorString}\\"\"}`))
})

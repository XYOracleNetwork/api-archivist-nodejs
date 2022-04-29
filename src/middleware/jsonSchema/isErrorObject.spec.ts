import { ErrorObject } from 'ajv'

import { isErrorObject } from './isErrorObject'

const errorObject: ErrorObject = {
  dataPath: '',
  keyword: 'required',
  message: "should have required property 'street'",
  params: {
    missingProperty: 'street',
  },
  schemaPath: '#/required',
}

describe('isErrorObject', () => {
  it('returns true if item exists', () => {
    expect(isErrorObject(errorObject)).toBeTruthy()
  })
  it('returns false if item is undefined', () => {
    expect(isErrorObject(undefined)).toBeFalsy()
  })
})

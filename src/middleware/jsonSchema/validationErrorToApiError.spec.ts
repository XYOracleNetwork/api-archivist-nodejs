import { ErrorObject } from 'ajv'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { validationErrorToApiError } from './validationErrorToApiError'

const validationError: ErrorObject = {
  dataPath: '',
  keyword: 'required',
  message: "should have required property 'street'",
  params: {
    missingProperty: 'street',
  },
  schemaPath: '#/required',
}

describe('validationErrorToApiError', () => {
  describe('converts a ValidationError to an ApiError where ApiError', () => {
    describe('code', () => {
      it('comes from validationError.keyword', () => {
        const actual = validationErrorToApiError(validationError)
        expect(actual.code).toBe(validationError.keyword)
      })
    })
    describe('detail', () => {
      it('comes from validationError.message', () => {
        const actual = validationErrorToApiError(validationError)
        expect(actual.detail).toBe(validationError.message)
      })
    })
    describe('id', () => {
      it('is undefined', () => {
        const actual = validationErrorToApiError(validationError)
        expect(actual.id).toBeUndefined()
      })
    })
    describe('links', () => {
      it('comes from validationError.keyword, dataPath, & schemaPath', () => {
        const actual = validationErrorToApiError(validationError)
        expect(actual.links).toStrictEqual({
          dataPath: {
            href: validationError.dataPath,
            meta: {},
          },
          schemaPath: {
            href: validationError.schemaPath,
            meta: {
              parentSchema: validationError.parentSchema,
            },
          },
        })
      })
    })
    describe('meta', () => {
      it('comes from validationError.params', () => {
        const actual = validationErrorToApiError(validationError)
        expect(actual.meta).toStrictEqual({
          params: validationError.params,
        })
      })
    })
    describe('status', () => {
      it(`is ${StatusCodes.BAD_REQUEST}`, () => {
        const actual = validationErrorToApiError(validationError)
        expect(actual.status).toBe(`${StatusCodes.BAD_REQUEST}`)
      })
    })
    describe('title', () => {
      it(`is ${ReasonPhrases.BAD_REQUEST}`, () => {
        const actual = validationErrorToApiError(validationError)
        expect(actual.title).toBe(ReasonPhrases.BAD_REQUEST)
      })
    })
  })
})

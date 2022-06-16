import { combineRules, PayloadArchiveRule, PayloadRule, PayloadSchemaRule, PayloadTimestampDirectionRule } from './PayloadRules'

// Mock Date.now
const now = new Date()
jest.useFakeTimers().setSystemTime(now)

const validRules = (): PayloadRule[][] => {
  return [[{ archive: 'foo' }], [{ schema: 'network.xyo.debug' }], [{ direction: 'desc', timestamp: Date.now() }]]
}

describe('PayloadRules', () => {
  describe('combineRules', () => {
    describe('with no rules', () => {
      it('should throw', () => {
        expect(() => {
          combineRules([])
        }).toThrow()
      })
      it('for archive should throw', () => {
        expect(() => {
          const rules = validRules().filter((rule) => !(rule?.[0] as PayloadArchiveRule)?.archive)
          combineRules(rules)
        }).toThrow()
      })
      it('for schema should throw', () => {
        expect(() => {
          const rules = validRules().filter((rule) => !(rule?.[0] as PayloadSchemaRule)?.schema)
          combineRules(rules)
        }).toThrow()
      })
      describe('for timestamp defaults to current time', () => {
        it('for timestamp defaults to current time', () => {
          const rules = validRules().filter((rule) => !(rule?.[0] as PayloadTimestampDirectionRule)?.timestamp)
          const actual = combineRules(rules)
          expect(actual.timestamp).toBe(+now)
        })
        it('for timestamp defaults to desc', () => {
          const rules = validRules().filter((rule) => !(rule?.[0] as PayloadTimestampDirectionRule)?.timestamp)
          const actual = combineRules(rules)
          expect(actual.direction).toBe('desc')
        })
      })
    })
  })
})

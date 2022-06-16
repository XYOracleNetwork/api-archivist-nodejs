import { assertEx, exists } from '@xylabs/sdk-js'

import { SortDirection } from '../../model'

export interface PayloadArchiveRule {
  archive: string
}
const isPayloadArchiveRule = (rule: PayloadRule): rule is PayloadArchiveRule => {
  return !!(rule as PayloadArchiveRule)?.archive
}

export interface PayloadTimestampDirectionRule {
  direction: SortDirection
  timestamp: number
}
const isPayloadTimestampDirectionRule = (rule: PayloadRule): rule is PayloadTimestampDirectionRule => {
  return !!(rule as PayloadTimestampDirectionRule)?.timestamp
}

export interface PayloadSchemaRule {
  schema: string
}
const isPayloadSchemaRule = (rule: PayloadRule): rule is PayloadSchemaRule => {
  return !!(rule as PayloadSchemaRule)?.schema
}

export type PayloadRule = PayloadArchiveRule | PayloadTimestampDirectionRule | PayloadSchemaRule
export interface PayloadSearchCriteria {
  archive: string[]
  direction: SortDirection
  schema: string[]
  timestamp: number
}

// TODO: AND first dimension, OR 2nd dimension of array
export const combineRules = (rules: PayloadRule[][]): PayloadSearchCriteria => {
  const archive = rules
    .flatMap((r) => r)
    .filter(isPayloadArchiveRule)
    .map((r) => r.archive)
    .filter(exists)
  assertEx(archive.length, 'At least one archive must be supplied')

  const schema = rules
    .flatMap((r) => r)
    .filter(isPayloadSchemaRule)
    .map((r) => r.schema)
    .filter(exists)
  assertEx(schema.length, 'At least one schema must be supplied')

  const directionTimestamp = rules
    .flatMap((r) => r)
    .filter(isPayloadTimestampDirectionRule)
    .filter(exists)
  assertEx(directionTimestamp.length < 2, 'Must not supply more than 1 direction/timestamp rule')

  const direction: SortDirection = directionTimestamp.length ? directionTimestamp[0]?.direction : 'desc'
  const timestamp: number = directionTimestamp.length ? directionTimestamp[0]?.timestamp : Date.now()

  return {
    archive,
    direction,
    schema,
    timestamp,
  }
}

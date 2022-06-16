import { exists } from '@xylabs/sdk-js'

import { SortDirection } from '../../model'

export interface PayloadArchiveRule {
  archive: string
}

export interface PayloadTimestampDirectionRule {
  direction: SortDirection
  timestamp: number
}

export interface PayloadSchemaRule {
  schema: string
}

export type PayloadRule = PayloadArchiveRule | PayloadTimestampDirectionRule | PayloadSchemaRule
export interface PayloadSearchCriteria {
  archive: string[]
  direction: SortDirection
  schema: string[]
  timestamp: number
}

export const combineRules = (rules: PayloadRule[][]): PayloadSearchCriteria => {
  const archive = rules
    .flatMap((r) => r)
    .map((r) => (r as PayloadArchiveRule)?.archive)
    .filter(exists)
  const schema = rules
    .flatMap((r) => r)
    .map((r) => (r as PayloadSchemaRule)?.schema)
    .filter(exists)
  const foundDirection = rules
    .flatMap((r) => r)
    .map((r) => (r as PayloadTimestampDirectionRule)?.direction)
    .filter(exists)
  const direction: SortDirection = foundDirection.length ? foundDirection[0] : 'desc'
  const foundTimestamp = rules
    .flatMap((r) => r)
    .map((r) => (r as PayloadTimestampDirectionRule)?.timestamp)
    .filter(exists)
  const timestamp: number = foundTimestamp.length ? foundTimestamp[0] : Date.now()
  return {
    archive,
    direction,
    schema,
    timestamp,
  }
}

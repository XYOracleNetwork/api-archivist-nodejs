import { assertEx, exists } from '@xylabs/sdk-js'

import { SortDirection } from '../../../model'
import { PayloadRule } from './PayloadRule'
import { PayloadSearchCriteria } from './PayloadSearchCriteria'
import { isPayloadArchiveRule, isPayloadSchemaRule, isPayloadTimestampDirectionRule } from './TypePredicates'

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

  const direction: SortDirection = directionTimestamp[0]?.direction || 'desc'
  const timestamp: number = directionTimestamp.length ? directionTimestamp[0]?.timestamp : Date.now()

  return {
    archive,
    direction,
    schema,
    timestamp,
  }
}

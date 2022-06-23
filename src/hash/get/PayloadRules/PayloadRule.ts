import { PayloadArchiveRule, PayloadSchemaRule, PayloadTimestampDirectionRule } from './Rules'

export type PayloadRule = PayloadArchiveRule | PayloadTimestampDirectionRule | PayloadSchemaRule

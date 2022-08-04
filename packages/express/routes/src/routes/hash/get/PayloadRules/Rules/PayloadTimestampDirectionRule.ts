import { SortDirection } from '@xyo-network/archivist-model'

export interface PayloadTimestampDirectionRule {
  direction?: SortDirection
  timestamp: number
}

import { SortDirection } from '../../../model'

export interface PayloadSearchCriteria {
  addresses: string[]
  archive: string[]
  direction: SortDirection
  schema: string[]
  timestamp: number
}

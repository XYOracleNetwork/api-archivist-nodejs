import { SortDirection } from '../../../model'

export interface PayloadSearchCriteria {
  archive: string[]
  direction: SortDirection
  schema: string[]
  timestamp: number
}

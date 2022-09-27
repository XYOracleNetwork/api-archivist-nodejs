import { BoundWitnessArchivist } from './BoundWitnessArchivist'

export interface ArchiveBoundWitnessArchivistId {
  archive: string
  hash: string
}

export type ArchiveBoundWitnessArchivist = BoundWitnessArchivist<ArchiveBoundWitnessArchivistId>

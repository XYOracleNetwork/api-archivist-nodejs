import { BoundWitnessArchivist } from './BoundWitnessArchivist'

export interface ArchiveBoundWitnessesArchivistId {
  archive: string
  hash: string
}

export type ArchiveBoundWitnessesArchivist = BoundWitnessArchivist<ArchiveBoundWitnessesArchivistId>

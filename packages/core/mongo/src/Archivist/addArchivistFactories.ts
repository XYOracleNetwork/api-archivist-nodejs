import { ArchiveBoundWitnessesArchivist, ArchivePayloadsArchivist } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container, interfaces } from 'inversify'

export const addArchivistFactories = (container: Container) => {
  container
    .bind<interfaces.Factory<ArchivePayloadsArchivist>>(TYPES.ArchivePayloadsArchivistFactory)
    .toFactory<ArchivePayloadsArchivist, [string]>((_context) => {
      return (_archive: string) => {
        throw new Error('')
      }
    })
  container
    .bind<interfaces.Factory<ArchiveBoundWitnessesArchivist>>(TYPES.ArchiveBoundWitnessesArchivistFactory)
    .toFactory<ArchiveBoundWitnessesArchivist, [string]>((_context) => {
      return (_archive: string) => {
        throw new Error('')
      }
    })
}

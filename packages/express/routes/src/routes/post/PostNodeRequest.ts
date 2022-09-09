import { ArchivePathParams } from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { Request } from 'express'

export type PostNodeRequest = Request<ArchivePathParams, string[][], XyoBoundWitness | XyoBoundWitness[]>

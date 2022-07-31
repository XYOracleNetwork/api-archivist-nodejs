import { ArchivePathParams } from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

export type PostNodeRequest = Request<ArchivePathParams, string[][], XyoBoundWitness | XyoBoundWitness[]>

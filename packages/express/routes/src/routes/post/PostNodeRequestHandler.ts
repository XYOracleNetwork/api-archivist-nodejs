import { ArchivePathParams } from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { RequestHandler } from 'express'

export type PostNodeRequestHandler = RequestHandler<ArchivePathParams, string[][], XyoBoundWitness | XyoBoundWitness[]>

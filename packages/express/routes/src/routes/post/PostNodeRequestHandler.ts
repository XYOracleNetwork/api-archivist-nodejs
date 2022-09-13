import { ArchivePathParams } from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoPayload } from '@xyo-network/payload'
import { RequestHandler } from 'express'

export type PostNodeRequestHandler = RequestHandler<ArchivePathParams, string[][], XyoPayload | XyoBoundWitness | XyoPayload[] | XyoBoundWitness[]>

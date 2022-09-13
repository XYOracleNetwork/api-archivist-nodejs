import { ArchivePathParams } from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoPayload } from '@xyo-network/payload'
import { Request } from 'express'

export type PostNodeRequest = Request<ArchivePathParams, string[][], XyoPayload | XyoBoundWitness | XyoPayload[] | XyoBoundWitness[]>

import { ArchivePathParams } from '@xyo-network/archivist-model'
import { XyoPayload } from '@xyo-network/payload'
import { Request } from 'express'

export type PostNodeRequest = Request<ArchivePathParams, string[][], XyoPayload | XyoPayload[]>

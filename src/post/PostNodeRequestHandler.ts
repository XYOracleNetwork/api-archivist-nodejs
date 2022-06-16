import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { ArchivePathParams } from '../model'

export type PostNodeRequestHandler = RequestHandler<ArchivePathParams, string[][], XyoBoundWitness | XyoBoundWitness[]>

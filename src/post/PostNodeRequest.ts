import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { ArchivePathParams } from '../model'

export type PostNodeRequest = Request<ArchivePathParams, string[][], XyoBoundWitness | XyoBoundWitness[]>

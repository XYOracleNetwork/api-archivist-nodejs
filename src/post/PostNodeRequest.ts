import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { PostNodePathParams } from '../model'

export type PostNodeRequest = Request<PostNodePathParams, string[][], XyoBoundWitness | XyoBoundWitness[]>

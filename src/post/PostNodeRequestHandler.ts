import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { PostNodePathParams } from '../model'

export type PostNodeRequestHandler = RequestHandler<PostNodePathParams, string[][], XyoBoundWitness | XyoBoundWitness[]>

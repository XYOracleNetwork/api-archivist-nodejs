import { XyoBoundWitness, XyoBoundWitnessBody } from '@xyo-network/sdk-xyo-client-js'

import { PayloadRepository } from './PayloadRepository'

export type BoundWitnessRepository<
  TWriteResponse extends XyoBoundWitness,
  TWrite extends XyoBoundWitnessBody,
  TReadResponse = TWriteResponse,
  TId = string,
  TQueryResponse = unknown,
  TQuery = unknown
> = PayloadRepository<TWriteResponse, TWrite, TReadResponse, TId, TQueryResponse, TQuery>

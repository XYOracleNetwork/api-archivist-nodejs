import { XyoBoundWitness, XyoBoundWitnessBody } from '@xyo-network/sdk-xyo-client-js'

import { BoundWitnessRepository } from './BoundWitnessRepository'

export abstract class AbstractBoundWitnessRepository<
  TWriteResponse extends XyoBoundWitness,
  TWrite extends XyoBoundWitnessBody,
  TReadResponse = TWriteResponse,
  TId = string,
  TQueryResponse = unknown,
  TQuery = unknown
> implements BoundWitnessRepository<TWriteResponse, TWrite, TReadResponse, TId, TQueryResponse, TQuery>
{
  abstract find(filter: TQuery): Promise<TQueryResponse>
  abstract get(id: TId): Promise<TReadResponse[]>
  abstract insert(items: TWrite[]): Promise<TWriteResponse[]>
}

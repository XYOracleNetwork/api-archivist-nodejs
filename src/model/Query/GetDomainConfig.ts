import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { Query } from './Query'

export const getDomainConfigSchema = 'network.xyo.domain.get'
export type GetDomainConfigSchema = typeof getDomainConfigSchema

export interface GetDomainConfig {
  domain: string
  proxy?: string
  schema: GetDomainConfigSchema
}

export type GetDomainConfigPayload = XyoPayload<GetDomainConfig>

export class GetDomainConfigQuery extends Query<GetDomainConfigPayload> {}

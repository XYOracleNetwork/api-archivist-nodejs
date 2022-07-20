import { XyoDomainPayload, XyoDomainPayloadWrapper, XyoPartialPayloadMeta } from '@xyo-network/sdk-xyo-client-js'

import { GetDomainConfigQuery, Optional, QueryHandler } from '../model'

export class GetDomainConfigQueryHandler implements QueryHandler<GetDomainConfigQuery, XyoDomainPayload> {
  async handle(query: GetDomainConfigQuery): Promise<Optional<XyoPartialPayloadMeta<XyoDomainPayload>>> {
    const config: XyoDomainPayloadWrapper<XyoPartialPayloadMeta<XyoDomainPayload>> | undefined = query.payload.proxy
      ? await XyoDomainPayloadWrapper.discover(query.payload.domain, query.payload.proxy)
      : await XyoDomainPayloadWrapper.discover(query.payload.domain)
    return config?.payload
  }
}

import { GetDomainConfigQuery, Optional, QueryHandler, XyoPartialPayloadMeta } from '@xyo-network/archivist-model'
import { XyoDomainPayload, XyoDomainPayloadWrapper } from '@xyo-network/domain-payload-plugin'

export class GetDomainConfigQueryHandler implements QueryHandler<GetDomainConfigQuery, XyoDomainPayload> {
  async handle(query: GetDomainConfigQuery): Promise<Optional<XyoPartialPayloadMeta<XyoDomainPayload>>> {
    const config: XyoDomainPayloadWrapper<XyoPartialPayloadMeta<XyoDomainPayload>> | undefined = query.payload.proxy
      ? await XyoDomainPayloadWrapper.discover(query.payload.domain, query.payload.proxy)
      : await XyoDomainPayloadWrapper.discover(query.payload.domain)
    return config?.payload
  }
}

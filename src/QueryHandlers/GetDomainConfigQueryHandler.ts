import { XyoDomainPayload, XyoDomainPayloadWrapper, XyoPartialPayloadMeta } from '@xyo-network/sdk-xyo-client-js'

import { GetDomainConfigQuery, Optional, QueryHandler } from '../model'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetDomainConfigQueryHandlerOpts {
  // TODO: Inject domain as repository instead of static method call
  // domainRepository: XyoDomainPayloadWrapper
}

export class GetDomainConfigQueryHandler implements QueryHandler<GetDomainConfigQuery, XyoDomainPayload> {
  constructor(protected readonly opts: GetDomainConfigQueryHandlerOpts) {}
  async handle(query: GetDomainConfigQuery): Promise<Optional<XyoPartialPayloadMeta<XyoDomainPayload>>> {
    const config: XyoDomainPayloadWrapper<XyoPartialPayloadMeta<XyoDomainPayload>> | undefined = query.payload.proxy
      ? await XyoDomainPayloadWrapper.discover(query.payload.domain, query.payload.proxy)
      : await XyoDomainPayloadWrapper.discover(query.payload.domain)
    return config?.payload
  }
}

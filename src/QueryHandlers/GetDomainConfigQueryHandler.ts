import { XyoDomainPayload, XyoDomainPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'

import { GetDomainConfigQuery, QueryHandler } from '../model'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetDomainConfigQueryHandlerOpts {
  // TODO: Inject domain as repository instead of static method call
  // domainRepository: XyoDomainPayloadWrapper
}

export class GetDomainConfigQueryHandler implements QueryHandler<GetDomainConfigQuery, XyoDomainPayload> {
  constructor(protected readonly opts: GetDomainConfigQueryHandlerOpts) {}
  async handle(query: GetDomainConfigQuery): Promise<XyoDomainPayload | undefined> {
    const config = query.payload.proxy
      ? await XyoDomainPayloadWrapper.discover(query.payload.domain, query.payload.proxy)
      : await XyoDomainPayloadWrapper.discover(query.payload.domain)
    return config?.body
  }
}

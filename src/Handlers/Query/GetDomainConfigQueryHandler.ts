import { XyoDomainPayload, XyoDomainPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'

import { GetDomainConfig, QueryHandler } from '../../model'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetDomainConfigQueryHandlerOpts {
  // TODO: Inject domain as repository instead of static method call
  // domainRepository: XyoDomainPayloadWrapper
}

export class GetDomainConfigQueryHandler implements QueryHandler<GetDomainConfig, XyoDomainPayload | undefined> {
  constructor(protected readonly opts: GetDomainConfigQueryHandlerOpts) {}
  async handle(command: GetDomainConfig): Promise<XyoDomainPayload | undefined> {
    const config = command.proxy ? await XyoDomainPayloadWrapper.discover(command.domain, command.proxy) : await XyoDomainPayloadWrapper.discover(command.domain)
    return config?.body
  }
}

import { XyoDiviner } from '@xyo-network/diviner'
import { XyoPayload } from '@xyo-network/payload'

import { ArchiveQueryPayload } from './ArchiveQueryPayload'

export type AddressHistorySchema = 'network.xyo.diviner.boundwitness.'
export const AddressHistorySchema: AddressHistorySchema = 'network.xyo.diviner.boundwitness.'

export type AddressHistoryQuerySchema = 'network.xyo.diviner.boundwitness.query'
export const AddressHistoryQuerySchema: AddressHistoryQuerySchema = 'network.xyo.diviner.boundwitness.query'

export type AddressHistoryConfigSchema = 'network.xyo.diviner.boundwitness.config'
export const AddressHistoryConfigSchema: AddressHistoryConfigSchema = 'network.xyo.diviner.boundwitness.config'

export type AddressHistoryPayload = XyoPayload<{ schema: AddressHistorySchema }>
export const isAddressHistoryPayload = (x?: XyoPayload | null): x is AddressHistoryPayload => x?.schema === AddressHistorySchema

export type AddressHistoryQueryPayload = ArchiveQueryPayload<{ schema: AddressHistoryQuerySchema } & { address: string }>
export const isAddressHistoryQueryPayload = (x?: XyoPayload | null): x is AddressHistoryQueryPayload => x?.schema === AddressHistoryQuerySchema

export type AddressHistoryDiviner = XyoDiviner

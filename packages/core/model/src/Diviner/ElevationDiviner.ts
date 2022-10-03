import { XyoDiviner, XyoDivinerConfig } from '@xyo-network/diviner'
import { XyoQuery } from '@xyo-network/module'
import { XyoPayload } from '@xyo-network/payload'

export type ElevationSchema = 'network.xyo.location.elevation'
export const ElevationSchema: ElevationSchema = 'network.xyo.location.elevation'

// TODO: Remove Archivist from name
export type ArchivistElevationDivinerConfigSchema = 'network.xyo.location.elevation.config'
export const ArchivistElevationDivinerConfigSchema: ArchivistElevationDivinerConfigSchema = 'network.xyo.location.elevation.config'

export type ArchivistElevationDivinerConfig<S extends string = string, T extends XyoPayload = XyoPayload> = XyoDivinerConfig<
  T & {
    schema: S
  }
>

export type ElevationQuerySchema = 'network.xyo.location.elevation.query'
export const ElevationQuerySchema: ElevationQuerySchema = 'network.xyo.location.elevation.query'

export type ElevationPayload = XyoPayload<{ schema: ElevationSchema }>
export const isElevationPayload = (x?: XyoPayload | null): x is ElevationPayload => x?.schema === ElevationSchema

export type ElevationQueryPayload = XyoQuery<{ schema: ElevationQuerySchema }>
export const isElevationQueryPayload = (x?: XyoPayload | null): x is ElevationQueryPayload => x?.schema === ElevationQuerySchema

export type ElevationDiviner = XyoDiviner

import { XyoDiviner, XyoDivinerConfig } from '@xyo-network/diviner'
import { XyoPayload } from '@xyo-network/payload'

export type ElevationSchema = 'network.xyo.location.elevation'
export const ElevationSchema: ElevationSchema = 'network.xyo.location.elevation'

export type ElevationDivinerConfigSchema = 'network.xyo.location.elevation.diviner.config'
export const ElevationDivinerConfigSchema: ElevationDivinerConfigSchema = 'network.xyo.location.elevation.diviner.config'

export type ElevationDivinerConfig<S extends string = string, T extends XyoPayload = XyoPayload> = XyoDivinerConfig<
  T & {
    schema: S
  }
>

export type ElevationPayload = XyoPayload<{ schema: ElevationSchema }>
export const isElevationPayload = (x?: XyoPayload | null): x is ElevationPayload => x?.schema === ElevationSchema

export type ElevationDiviner = XyoDiviner

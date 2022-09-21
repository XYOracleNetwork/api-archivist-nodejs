import { Archivist, XyoArchivistQuery } from '@xyo-network/archivist'
import { Module } from '@xyo-network/module'

import { XyoPayloadWithMeta } from '../Payload'

export type WitnessedPayloadArchivist = Archivist<XyoPayloadWithMeta> & Module<XyoArchivistQuery>

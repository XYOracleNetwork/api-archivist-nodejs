import { Archivist } from '@xyo-network/archivist'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoPayloadWithPartialMeta } from '@xyo-network/payload'

import { SetArchivePermissions } from '../Query'

export type ArchivePermissionsArchivist = Archivist<SetArchivePermissions, XyoBoundWitness | null, XyoPayloadWithPartialMeta<SetArchivePermissions>>

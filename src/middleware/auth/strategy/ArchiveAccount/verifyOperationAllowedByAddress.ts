import { XyoBoundWitness, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { PostNodePathParams, SetArchivePermissions, setArchivePermissionsSchema } from '../../../../model'

const defaultArchivePermissions: SetArchivePermissions = {
  schema: setArchivePermissionsSchema,
}

const getArchivePermissions = async (req: Request<unknown, unknown, XyoBoundWitness[]>, archive: string): Promise<SetArchivePermissions> => {
  const permissions = await req.app.archivePermissionsRepository.get(archive)
  return permissions && permissions?.[0] ? permissions?.[0] : defaultArchivePermissions
}

const verifyAccountAllowed = (address: string | undefined, permissions: SetArchivePermissions): boolean => {
  const allowedAddresses = permissions?.allow?.addresses
  const disallowedAddresses = permissions?.reject?.addresses

  // If there's address restrictions on the archive and this
  // is an anonymous request
  if ((allowedAddresses?.length || disallowedAddresses?.length) && !address) return false

  // If there's rejected addresses
  if (disallowedAddresses) {
    // And this address is one of them
    if (disallowedAddresses.some((disallowed) => disallowed.toLowerCase() === address?.toLowerCase())) return false
  }
  // If there's allowed addresses
  if (allowedAddresses) {
    // Return true if this address is allowed, otherwise false
    return allowedAddresses.some((allowed) => allowed.toLowerCase() === address?.toLowerCase()) ? true : false
  }
  return true
}
const verifySchemaAllowed = (schema: string, permissions: SetArchivePermissions): boolean => {
  const allowedSchemas = permissions?.allow?.schemas
  const disallowedSchemas = permissions?.reject?.schemas

  // If there's no schema restrictions on the archive
  if (!allowedSchemas?.length && !disallowedSchemas?.length) return true

  // TODO: Support GLOB patterns for allowed/disallowed schemas

  // If there's rejected schemas
  if (disallowedSchemas) {
    // And this schema is one of them
    if (disallowedSchemas.some((disallowed) => disallowed.toLowerCase() === schema.toLowerCase())) return false
  }
  // If there's allowed schemas
  if (allowedSchemas) {
    // Return true if this schema is allowed, otherwise false
    return allowedSchemas.some((allowed) => allowed.toLowerCase() === schema.toLowerCase()) ? true : false
  }
  return true
}

export const verifyOperationAllowedByAddress = async (req: Request<PostNodePathParams, unknown, XyoBoundWitness[]>): Promise<boolean> => {
  // NOTE: Communicate partial success for allowed/disallowed operations
  // Short circuit & reduce all operations to binary success/failure for now
  // Get archive permissions
  const { archive } = req.params
  if (!archive) return false
  const permissions = await getArchivePermissions(req, archive)
  const address = req?.user?.address
  if (!verifyAccountAllowed(address, permissions)) return false
  for (let i = 0; i < req.body.length; i++) {
    const bw = req.body[i]
    if (bw._payloads?.length) {
      for (let j = 0; j < bw._payloads.length; j++) {
        const p: XyoPayload = bw._payloads[j]
        if (!p.schema || !verifySchemaAllowed(p.schema, permissions)) return false
      }
    }
  }
  return true
}

import { XyoAccount } from '@xyo-network/sdk-xyo-client-js'
import { v1 } from 'uuid'

// TODO: Get via DI or static access so we can abstract away locality of
// Account access since it won't always be local to the archivist
// NOTE: We'll want to move to a distributed account that can be shared
// among multiple archivists so that we can maintain a consistent chain
// when running multiple networked archivists
/**
 * Create an Account we'll use to witness each request with during the
 * lifetime of the program
 */
const address = new XyoAccount({ phrase: v1() })

export const getAccount = (): XyoAccount => {
  return address
}

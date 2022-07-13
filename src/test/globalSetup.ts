import { assertEx } from '@xylabs/sdk-js'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { claimArchive, getArchive, getTokenForNewUser } from './testUtil'

/**
 * Jest global setup method run before
 * any tests are run
 * https://jestjs.io/docs/configuration#globalsetup-string
 */
module.exports = async () => {
  const name = 'temp'
  // let archive: XyoArchive
  // try {
  //   archive = await getArchive(name)
  // } catch (error) {
  //   // TODO: Should we create archive as owned by
  //   // unit test account if non-existent
  //   console.log('Temp archive does not exist, creating...')
  //   const token = await getTokenForNewUser()
  //   archive = await claimArchive(token, name)
  // }
  // assertEx(archive.archive === name, 'ERROR: Temp archive does not exist')
  // assertEx(!archive.accessControl, 'ERROR: Temp archive must be public')
}

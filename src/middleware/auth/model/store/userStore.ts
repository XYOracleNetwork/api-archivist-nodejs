import { UpsertResult } from '../../../../lib'
import { User, UserWithoutId } from '../../../../model'

/**
 * @deprecated Use app.userManager instead
 */
export interface UserStore {
  create(user: UserWithoutId): Promise<User & UpsertResult>
}

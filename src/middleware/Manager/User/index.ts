import { UserManager } from './UserManager'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      userManager: UserManager
    }
  }
}

export * from './MongoDB'
export * from './UserManager'

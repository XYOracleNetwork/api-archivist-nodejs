import { UserRepository } from './UserRepository'
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      userRepository: UserRepository
    }
  }
}

export * from './MongoDBUserRepository'
export * from './UserRepository'

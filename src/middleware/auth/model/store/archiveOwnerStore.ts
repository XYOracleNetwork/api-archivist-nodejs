export type GetArchivesByUserFn = (user: string) => Promise<string[]>

export interface IArchiveOwnerStore {
  getArchivesOwnedByUser(id: string): Promise<string[]>
}

export class ArchiveOwnerStore implements IArchiveOwnerStore {
  constructor(private readonly getUserArchives: GetArchivesByUserFn) {}
  async getArchivesOwnedByUser(id: string): Promise<string[]> {
    return await this.getUserArchives(id)
  }
}

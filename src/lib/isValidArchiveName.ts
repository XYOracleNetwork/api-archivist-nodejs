const pattern = /^[a-z0-9-]+$/

export const isValidArchiveName = (archive: string) => {
  return pattern.test(archive)
}

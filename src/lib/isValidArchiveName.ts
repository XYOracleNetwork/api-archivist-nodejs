const pattern = /^[a-zA-Z0-9-_]+$/

export const isValidArchiveName = (archive: string) => {
  return pattern.test(archive)
}

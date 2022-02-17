interface AccessControl {
  accessControl?: boolean
}

export const determineArchiveAccessControl = (record: AccessControl) => {
  const { accessControl } = record
  return accessControl || false
}

export const tryParseFloat = (value?: string) => {
  try {
    const result = value ? parseFloat(value) : null
    if (!Number.isNaN(result) && result !== null) {
      return result
    }
  } catch {
    return undefined
  }
  return undefined
}

export const tryParseInt = (value?: string) => {
  try {
    const result = value ? parseInt(value) : null
    if (!Number.isNaN(result) && result !== null) {
      return result
    }
  } catch {
    return undefined
  }
  return undefined
}

export const removeUndefinedOrNull = <T extends Record<string, unknown>>(obj: T) => {
  const result: Record<string, unknown> = {}
  Object.keys(obj).forEach((key: string) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      result[key] = obj[key]
    }
  })
  return result as T
}

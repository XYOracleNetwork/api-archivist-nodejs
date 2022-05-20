import { Request } from 'express'

/**
 * Since there can be multiple of certain HTTP headers or
 * to prevent ugliness if someone did send us multiple
 * instances of a header we only expect one of, this
 * method grabs the 1st/only one of the desired header
 * @param header The header to find
 * @param req The received HTTP request (with headers)
 * @returns The first or only occurrence of the specified HTTP header
 */
export const getHttpHeader = (header: string, req: Request): string | undefined => {
  const value =
    // If the header exists
    req.headers[header]
      ? // If there's multiple of the same header
        Array.isArray(req.headers[header])
        ? // Grab the first one
          (req.headers[header] as string[]).shift()
        : // Otherwise grab the only one
          (req.headers[header] as string)
      : // Otherwise undefined
        undefined
  return value
}

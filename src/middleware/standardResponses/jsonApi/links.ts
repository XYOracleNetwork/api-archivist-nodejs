export interface HrefWithMeta {
  href: string
  meta: Record<string, unknown>
}
export type ApiLink = string | HrefWithMeta
export type ApiLinks = Record<string, ApiLink>

export interface ILink {
  href: string
  meta: Record<string, unknown>
}
export type Link = string | ILink
export type Links = Record<string, Link>

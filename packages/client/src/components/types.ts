export type Component = 'body'|'entry'|'handle'

export type ColorDefinition = {
  name:string,
  code:string
}
export type ColorOption = {
  [K in Component]: ColorDefinition
}

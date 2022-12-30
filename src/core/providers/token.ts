export type ITokenProvider = {
  generate(sub: string): string
}

import { Either } from '@/utils/either.js'

export type ITokenProvider = {
  generate(sub: string): string
  verify(token: string): Either<Error, string>
}

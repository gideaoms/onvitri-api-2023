import { Either } from '@/utils/either.js'

export type Provider = {
  generate(sub: string): string
  verify(token: string): Either<Error, string>
}

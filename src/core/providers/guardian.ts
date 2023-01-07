import * as Models from '@/core/models/mod.js'
import { Either } from '@/utils/either.js'

export type Provider = {
  passThrough(token: string): Promise<Either<Error, Models.User.Model>>
}

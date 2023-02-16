import * as UserModel from '@/core/models/user.js'
import { Either } from '@/utils/either.js'

export type Provider = {
  passThrough(token: string): Promise<Either<Error, UserModel.Model>>
}

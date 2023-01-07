import * as Models from '@/core/models/mod.js'
import { Either } from '@/utils/either.js'

export type Repository = {
  findByEmail(email: string): Promise<Either<Error, Models.User.Model>>
  findById(userId: string): Promise<Either<Error, Models.User.Model>>
}

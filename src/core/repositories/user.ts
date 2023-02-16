import * as UserModel from '@/core/models/user.js'
import { Either } from '@/utils/either.js'

export type Repository = {
  findByEmail(email: string): Promise<Either<Error, UserModel.Model>>
  findById(userId: string): Promise<Either<Error, UserModel.Model>>
  update(user: UserModel.Model): Promise<UserModel.Model>
}

import { User } from '@/core/entities/user.js'
import { Either } from '@/utils/either.js'

export type IUserRepository = {
  findByEmail(email: string): Promise<Either<Error, User>>
}

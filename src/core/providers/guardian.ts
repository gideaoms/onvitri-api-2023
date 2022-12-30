import { User } from '@/core/entities/user.js'
import { Either } from '@/utils/either.js'

export type IGuardianProvider = {
  passThrough(token: string): Promise<Either<Error, User>>
}

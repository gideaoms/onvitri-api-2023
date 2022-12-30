import { User } from '@/core/entities/user.js'
import { NotFoundError } from '@/core/errors/not-found.js'
import { IUserRepository } from '@/core/repositories/user.js'
import { prisma } from '@/infra/libs/prisma.js'
import { failure, success } from '@/utils/either.js'

export class UserRepository implements IUserRepository {
  public async findByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })
    if (!user) {
      return failure(new NotFoundError('User not found'))
    }
    return success(
      new User({
        id: user.id,
        name: user.name,
        email: user.email,
        validationCode: user.validation_code,
        status: user.status,
      }),
    )
  }
}

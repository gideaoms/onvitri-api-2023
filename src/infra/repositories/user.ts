import errors from 'http-errors'
import orm from '@/infra/libs/prisma.js'
import * as Repositories from '@/core/repositories/mod.js'
import * as Either from '@/utils/either.js'
import * as Mappers from '@/infra/mappers/mod.js'

export class Repository implements Repositories.User.Repository {
  async findByEmail(email: string) {
    const user = await orm.user.findUnique({
      where: {
        email: email,
      },
    })
    if (!user) {
      return Either.failure(new errors.NotFound('User not found'))
    }
    return Either.success(Mappers.User.toModel(user))
  }

  async findById(userId: string) {
    const user = await orm.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user) {
      return Either.failure(new errors.NotFound('User not found'))
    }
    return Either.success(Mappers.User.toModel(user))
  }
}

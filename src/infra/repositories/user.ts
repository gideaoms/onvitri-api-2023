import errors from 'http-errors'
import orm from '@/infra/libs/prisma.js'
import * as UserRepository from '@/core/repositories/user.js'
import * as Either from '@/utils/either.js'
import * as UserMapper from '@/infra/mappers/user.js'
import * as UserModel from '@/core/models/user.js'

export class Repository implements UserRepository.Repository {
  async findByEmail(email: string) {
    const user = await orm.user.findUnique({
      where: {
        email: email,
      },
    })
    if (!user) {
      return Either.failure(new errors.NotFound('User not found'))
    }
    return Either.success(UserMapper.toModel(user))
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
    return Either.success(UserMapper.toModel(user))
  }

  async update(user: UserModel.Model) {
    const updated = await orm.user.update({
      data: UserMapper.fromModel(user),
      where: {
        id: user.id,
      },
    })
    return UserMapper.toModel(updated)
  }
}

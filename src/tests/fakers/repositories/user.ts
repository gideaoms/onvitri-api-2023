import errors from 'http-errors'
import * as UserRepository from '@/core/repositories/user.js'
import * as UserModel from '@/core/models/user.js'
import * as Either from '@/utils/either.js'

export class Repository implements UserRepository.Repository {
  private readonly _users: UserModel.Model[] = []

  async findByEmail(email: string) {
    const user = this._users.find(user => user.email === email)
    if (!user) {
      return Either.failure(new errors.NotFound('User not found'))
    }
    return Either.success(user)
  }

  async findById(userId: string) {
    const user = this._users.find(user => user.id === userId)
    if (!user) {
      return Either.failure(new errors.NotFound('User not found'))
    }
    return Either.success(user)
  }

  async create(user: UserModel.Model) {
    const newUser = Object.assign(user, { id: String(this._users.length + 1) })
    this._users.push(newUser)
    return newUser
  }

  async update(userToUpdate: UserModel.Model) {
    this._users.map(user => (user.id === userToUpdate.id ? userToUpdate : user))
    return userToUpdate
  }
}

import errors from 'http-errors'
import * as Repositories from '@/core/repositories/mod.js'
import * as Models from '@/core/models/mod.js'
import * as Either from '@/utils/either.js'

export class Repository implements Repositories.User.Repository {
  private readonly _users: Models.User.Model[] = []

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

  async create(user: Models.User.Model) {
    const newUser = Object.assign(user, { id: String(this._users.length + 1) })
    this._users.push(newUser)
    return newUser
  }

  async update(userToUpdate: Models.User.Model) {
    this._users.map(user => (user.id === userToUpdate.id ? userToUpdate : user))
    return userToUpdate
  }
}

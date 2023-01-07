import * as Repositories from '@/core/repositories/mod.js'
import * as Models from '@/core/models/mod.js'
import * as Either from '@/utils/either.js'
import * as Errors from '@/core/errors/mod.js'

export class Repository implements Repositories.User.Repository {
  private readonly _users: Models.User.Model[] = []

  async findByEmail(email: string) {
    const user = this._users.find(user => user.email === email)
    if (!user) {
      return Either.failure(new Errors.NotFound.Error('User not found'))
    }
    return Either.success(user)
  }

  async findById(userId: string) {
    const user = this._users.find(user => user.id === userId)
    if (!user) {
      return Either.failure(new Errors.NotFound.Error('User not found'))
    }
    return Either.success(user)
  }

  async create(user: Models.User.Model) {
    const newUser = Object.assign(user, { id: String(this._users.length + 1) })
    this._users.push(newUser)
    return newUser
  }
}

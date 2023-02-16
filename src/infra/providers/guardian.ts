import errors from 'http-errors'
import * as UserModel from '@/core/models/user.js'
import * as GuardianProvider from '@/core/providers/guardian.js'
import * as TokenProvider from '@/core/providers/token.js'
import * as UserRepository from '@/core/repositories/user.js'
import * as Either from '@/utils/either.js'

export class Provider implements GuardianProvider.Provider {
  constructor(
    private readonly _tokenProvider: TokenProvider.Provider,
    private readonly _userRepository: UserRepository.Repository,
  ) {}

  async passThrough(token: string) {
    if (!token) {
      return Either.failure(new errors.Unauthorized())
    }
    const [, rawToken] = token.split(' ')
    if (!rawToken) {
      return Either.failure(new errors.Unauthorized())
    }
    const userId = this._tokenProvider.verify(rawToken)
    if (Either.isFailure(userId)) {
      return Either.failure(new errors.Unauthorized())
    }
    const user = await this._userRepository.findById(userId.success)
    if (Either.isFailure(user)) {
      return Either.failure(new errors.Unauthorized())
    }
    if (!UserModel.isActive(user.success)) {
      return Either.failure(new errors.Unauthorized('Inactivated profile'))
    }
    return Either.success(UserModel.build({ ...user.success, token: rawToken }))
  }
}

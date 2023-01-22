import errors from 'http-errors'
import * as Models from '@/core/models/mod.js'
import * as Providers from '@/core/providers/mod.js'
import * as Repositories from '@/core/repositories/mod.js'
import * as Either from '@/utils/either.js'

export class Provider implements Providers.Guardian.Provider {
  constructor(
    private readonly _tokenProvider: Providers.Token.Provider,
    private readonly _userRepository: Repositories.User.Repository,
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
    if (!Models.User.isActive(user.success)) {
      return Either.failure(new errors.Unauthorized('Inactivated profile'))
    }
    return Either.success(Models.User.build({ ...user.success, token: rawToken }))
  }
}

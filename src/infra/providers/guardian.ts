import * as Models from '@/core/models/mod.js'
import * as Errors from '@/core/errors/mod.js'
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
      return Either.failure(new Errors.Unauthorized.Error('Unauthorized'))
    }
    const [, rawToken] = token.split(' ')
    if (!rawToken) {
      return Either.failure(new Errors.Unauthorized.Error('Unauthorized'))
    }
    const userId = this._tokenProvider.verify(rawToken)
    if (Either.isFailure(userId)) {
      return Either.failure(new Errors.Unauthorized.Error('Unauthorized'))
    }
    const user = await this._userRepository.findById(userId.success)
    if (Either.isFailure(user)) {
      return Either.failure(new Errors.Unauthorized.Error('Unauthorized'))
    }
    if (!user.success.isActive()) {
      return Either.failure(
        new Errors.Unauthorized.Error('O seu perfil não está ativo na plataforma'),
      )
    }
    return Either.success(new Models.User.Model({ ...user.success, token: rawToken }))
  }
}

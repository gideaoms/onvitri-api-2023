import * as Either from '@/utils/either.js'
import * as Repositories from '@/core/repositories/mod.js'
import * as Providers from '@/core/providers/mod.js'
import * as Errors from '@/core/errors/mod.js'
import * as Mappers from '@/core/mappers/mod.js'
import * as Models from '@/core/models/mod.js'

export class Service {
  constructor(
    private readonly _userRepository: Repositories.User.Repository,
    private readonly _tokenProvider: Providers.Token.Provider,
  ) {}

  async exec(email: string, validationCode: string) {
    const message = 'Email e/ou código incorretos'
    const user = await this._userRepository.findByEmail(email)
    if (Either.isFailure(user)) {
      return Either.failure(new Errors.BadRequest.Error(message))
    }
    const isValidationCodeCorrect = user.success.validationCode === validationCode
    if (!isValidationCodeCorrect) {
      return Either.failure(new Errors.BadRequest.Error(message))
    }
    const generatedToken = this._tokenProvider.generate(user.success.id)
    const userWithToken = new Models.User.Model({ ...user.success, token: generatedToken })
    return Either.success(Mappers.User.toObject(userWithToken))
  }
}

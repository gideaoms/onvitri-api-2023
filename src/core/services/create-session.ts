import errors from 'http-errors'
import * as Either from '@/utils/either.js'
import * as UserRepository from '@/core/repositories/user.js'
import * as TokenProvider from '@/core/providers/token.js'
import * as UserMapper from '@/core/mappers/user.js'
import * as UserModel from '@/core/models/user.js'

export class Service {
  constructor(
    private readonly _userRepository: UserRepository.Repository,
    private readonly _tokenProvider: TokenProvider.Provider,
  ) {}

  async exec(email: string, validationCode: string) {
    const message = 'Email e/ou código incorretos'
    const user = await this._userRepository.findByEmail(email)
    if (Either.isFailure(user)) {
      return Either.failure(new errors.BadRequest(message))
    }
    const isValidationCodeCorrect = user.success.validationCode === validationCode
    if (!isValidationCodeCorrect) {
      return Either.failure(new errors.BadRequest(message))
    }
    const generatedToken = this._tokenProvider.generate(user.success.id)
    const userWithToken = UserModel.build({ ...user.success, token: generatedToken })
    return Either.success(UserMapper.toObject(userWithToken))
  }
}

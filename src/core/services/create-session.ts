import errors from 'http-errors'
import * as Either from '@/utils/either.js'
import * as UserRepository from '@/core/repositories/user.js'
import * as TokenProvider from '@/core/providers/token.js'
import * as UserMapper from '@/core/mappers/user.js'
import * as UserModel from '@/core/models/user.js'
import * as StoreMapper from '@/core/mappers/store.js'
import * as StoreRepository from '@/core/repositories/store.js'

export class Service {
  constructor(
    private readonly _userRepository: UserRepository.Repository,
    private readonly _tokenProvider: TokenProvider.Provider,
    private readonly _storeRepository: StoreRepository.Repository,
  ) {}

  async exec(email: string, validationCode: string) {
    const message = 'Email e/ou código incorretos'
    const user = await this._userRepository.findByEmail(email)
    if (Either.isFailure(user)) {
      return Either.failure(new errors.BadRequest(message))
    }
    const isValidationCodeCorrect =
      user.success.validationCode === validationCode
    if (!isValidationCodeCorrect) {
      return Either.failure(new errors.BadRequest(message))
    }
    const generatedToken = this._tokenProvider.generate(user.success.id)
    const userWithToken = UserModel.build({
      ...user.success,
      token: generatedToken,
    })
    if (user.success.defaultStoreId) {
      const store = await this._storeRepository.findOne(
        user.success.defaultStoreId,
      )
      if (Either.isFailure(store)) {
        return Either.failure(store.failure)
      }
      return Either.success({
        ...UserMapper.toObject(userWithToken),
        default_store: StoreMapper.toObject(store.success),
      })
    }
    return Either.success(UserMapper.toObject(userWithToken))
  }
}

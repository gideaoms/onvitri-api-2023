import * as GuardianProvider from '@/core/providers/guardian.js'
import * as Either from '@/utils/either.js'
import * as UserMapper from '@/core/mappers/user.js'
import * as StoreMapper from '@/core/mappers/store.js'
import * as StoreRepository from '@/core/repositories/store.js'

export class Service {
  constructor(
    private readonly _guardianProvider: GuardianProvider.Provider,
    private readonly _storeRepository: StoreRepository.Repository,
  ) {}

  async exec(token: string) {
    const user = await this._guardianProvider.passThrough(token)
    if (Either.isFailure(user)) {
      return Either.failure(user.failure)
    }
    if (user.success.defaultStoreId) {
      const store = await this._storeRepository.findOne(
        user.success.defaultStoreId,
      )
      if (Either.isFailure(store)) {
        throw new Error(`Something went wrong`, { cause: store.failure })
      }
      return Either.success({
        ...UserMapper.toObject(user.success),
        default_store: StoreMapper.toObject(store.success),
      })
    }
    return Either.success(UserMapper.toObject(user.success))
  }
}

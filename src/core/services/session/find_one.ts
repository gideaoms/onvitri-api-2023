import * as Providers from '@/core/providers/mod.js'
import * as Either from '@/utils/either.js'
import * as Mappers from '@/core/mappers/mod.js'
import * as Repositories from '@/core/repositories/mod.js'

export class Service {
  constructor(
    private readonly _guardianProvider: Providers.Guardian.Provider,
    private readonly _storeRepository: Repositories.Store.Repository,
  ) {}

  async exec(token: string) {
    const user = await this._guardianProvider.passThrough(token)
    if (Either.isFailure(user)) {
      return Either.failure(user.failure)
    }
    if (user.success.defaultStoreId) {
      const store = await this._storeRepository.findOne(user.success.defaultStoreId)
      if (Either.isFailure(store)) {
        throw new Error(`Something went wrong`, { cause: store.failure })
      }
      return Either.success({
        ...Mappers.User.toObject(user.success),
        store: Mappers.Store.toObject(store.success),
      })
    }
    return Either.success(Mappers.User.toObject(user.success))
  }
}

import errors from 'http-errors'
import * as Repositories from '@/core/repositories/mod.js'
import * as Providers from '@/core/providers/mod.js'
import * as Either from '@/utils/either.js'
import * as Models from '@/core/models/mod.js'
import * as Mappers from '@/core/mappers/mod.js'

export class Service {
  constructor(
    private readonly _guardianProvider: Providers.Guardian.Provider,
    private readonly _userRepository: Repositories.User.Repository,
    private readonly _storeRepository: Repositories.Store.Repository,
  ) {}

  async exec(defaultStoreId: string, token: string) {
    const user = await this._guardianProvider.passThrough(token)
    if (Either.isFailure(user)) {
      return Either.failure(user.failure)
    }
    const store = await this._storeRepository.findOne(defaultStoreId)
    if (Either.isFailure(store)) {
      return Either.failure(store.failure)
    }
    const isOwner = store.success.ownerId === user.success.id
    if (!isOwner) {
      return Either.failure(new errors.BadRequest('A loja informada pertence à outra pessoa'))
    }
    const userToUpdate = Models.User.build({
      ...user.success,
      defaultStoreId,
    })
    const updated = await this._userRepository.update(userToUpdate)
    return Either.success({
      ...Mappers.User.toObject(updated),
      store: Mappers.Store.toObject(store.success),
    })
  }
}

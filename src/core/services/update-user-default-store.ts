import errors from 'http-errors'
import * as UserRepository from '@/core/repositories/user.js'
import * as StoreRepository from '@/core/repositories/store.js'
import * as GuardianProvider from '@/core/providers/guardian.js'
import * as Either from '@/utils/either.js'
import * as UserModel from '@/core/models/user.js'
import * as UserMapper from '@/core/mappers/user.js'
import * as StoreMapper from '@/core/mappers/store.js'

export class Service {
  constructor(
    private readonly _guardianProvider: GuardianProvider.Provider,
    private readonly _userRepository: UserRepository.Repository,
    private readonly _storeRepository: StoreRepository.Repository,
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
      return Either.failure(
        new errors.BadRequest('You are not the owner of this store'),
      )
    }
    const userToUpdate = UserModel.build({
      ...user.success,
      defaultStoreId,
    })
    const updatedUser = await this._userRepository.update(userToUpdate)
    return Either.success({
      ...UserMapper.toObject(updatedUser),
      default_store: StoreMapper.toObject(store.success),
    })
  }
}

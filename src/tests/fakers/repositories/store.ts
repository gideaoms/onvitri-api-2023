import errors from 'http-errors'
import * as StoreRepository from '@/core/repositories/store.js'
import * as StoreModel from '@/core/models/store.js'
import * as Either from '@/utils/either.js'

export class Repository implements StoreRepository.Repository {
  private readonly _stores: StoreModel.Model[] = []

  async findOne(storeId: string) {
    const store = this._stores.find(store => store.id === storeId)
    if (!store) {
      return Either.failure(new errors.NotFound('Store not found'))
    }
    return Either.success(store)
  }

  async create(store: StoreModel.Model) {
    const newStore = Object.assign(store, { id: String(this._stores.length + 1) })
    this._stores.push(newStore)
    return newStore
  }
}

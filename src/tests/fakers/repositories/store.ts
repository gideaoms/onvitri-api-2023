import * as Repositories from '@/core/repositories/mod.js'
import * as Models from '@/core/models/mod.js'
import * as Either from '@/utils/either.js'
import * as Errors from '@/core/errors/mod.js'

export class Repository implements Repositories.Store.Repository {
  private readonly _stores: Models.Store.Model[] = []

  async findOne(storeId: string) {
    const store = this._stores.find(store => store.id === storeId)
    if (!store) {
      return Either.failure(new Errors.NotFound.Error('Store not found'))
    }
    return Either.success(store)
  }

  async create(store: Models.Store.Model) {
    this._stores.push(Object.assign(store, { id: String(this._stores.length + 1) }))
    return store
  }
}

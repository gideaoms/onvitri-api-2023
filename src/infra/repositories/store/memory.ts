import { StoreRepository } from '@/core/repositories/store.js'
import { Store } from '@/core/store.js'

class MemoryStoreRepository implements StoreRepository {
  private readonly stores: Store[] = []

  public async create(store: Store): Promise<Store> {
    this.stores.push(store)
    return store
  }

  public async findMany(): Promise<Store[]> {
    return this.stores
  }
}

export { MemoryStoreRepository }

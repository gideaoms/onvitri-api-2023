import { Store } from '@/core/store.js'

type StoreRepository = {
  create(store: Store): Promise<Store>
  findMany(page: number): Promise<Store[]>
}

export { StoreRepository }

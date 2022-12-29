import { Store } from '@/core/store.js'
import { Either } from '@/utils/either.js'

type StoreRepository = {
  findOne(storeId: string): Promise<Either<Error, Store>>
  findMany(page: number): Promise<Store[]>
}

export { StoreRepository }

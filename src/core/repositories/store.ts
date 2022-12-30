import { Store } from '@/core/entities/store.js'
import { Either } from '@/utils/either.js'

export type IStoreRepository = {
  findOne(storeId: string): Promise<Either<Error, Store>>
}

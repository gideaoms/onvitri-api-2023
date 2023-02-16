import * as StoreModel from '@/core/models/store.js'
import { Either } from '@/utils/either.js'

export type Repository = {
  findOne(storeId: string): Promise<Either<Error, StoreModel.Model>>
}

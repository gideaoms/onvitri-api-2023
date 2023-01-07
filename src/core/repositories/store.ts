import * as Models from '@/core/models/mod.js'
import { Either } from '@/utils/either.js'

export type Repository = {
  findOne(storeId: string): Promise<Either<Error, Models.Store.Model>>
}

import * as Models from '@/core/models/mod.js'
import { Either } from '@/utils/either.js'

export type Repository = {
  findOne(productId: string, ownerId: string): Promise<Either<Error, Models.Product.Model>>
  remove(product: Models.Product.Model): Promise<void>
  create(product: Models.Product.Model): Promise<Models.Product.Model>
  update(product: Models.Product.Model): Promise<Models.Product.Model>
}

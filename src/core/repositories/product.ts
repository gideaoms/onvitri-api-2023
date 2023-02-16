import * as ProductModel from '@/core/models/product.js'
import { Either } from '@/utils/either.js'

export type Repository = {
  findOne(productId: string, ownerId: string): Promise<Either<Error, ProductModel.Model>>
  remove(product: ProductModel.Model): Promise<void>
  create(product: ProductModel.Model): Promise<ProductModel.Model>
  update(product: ProductModel.Model): Promise<ProductModel.Model>
}

import { Product } from '@/core/entities/product.js'
import { Either } from '@/utils/either.js'

export type IProductRepository = {
  findOne(productId: string, ownerId: string): Promise<Either<Error, Product>>
  remove(product: Product): Promise<void>
}

import { Product } from '@/core/entities/product.js'
import { NotFoundError } from '@/core/errors/not-found.js'
import { IProductRepository } from '@/core/repositories/product.js'
import { prisma } from '@/infra/libs/prisma.js'
import { failure, success } from '@/utils/either.js'

export class ProductRepository implements IProductRepository {
  public async findOne(productId: string, ownerId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          owner_id: ownerId,
        },
      },
    })
    if (!product) return failure(new NotFoundError('Product not found'))
    return success(new Product({ id: product.id, description: product.description }))
  }

  public async remove(product: Product) {
    await prisma.product.delete({
      where: {
        id: product.id,
      },
    })
  }
}

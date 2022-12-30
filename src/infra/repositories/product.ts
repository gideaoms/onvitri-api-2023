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
    return success(
      new Product({
        id: product.id,
        storeId: product.store_id,
        description: product.description,
        status: product.status,
        images: [],
      }),
    )
  }

  public async remove(product: Product) {
    await prisma.product.delete({
      where: {
        id: product.id,
      },
    })
  }

  public async create(product: Product) {
    const created = await prisma.product.create({
      data: {
        id: product.id,
        store_id: product.storeId,
        description: product.description,
        status: product.status,
        images: [],
      },
    })
    return created.id
  }

  public async update(product: Product) {
    await prisma.product.update({
      data: {
        id: product.id,
        store_id: product.storeId,
        description: product.description,
        status: product.status,
        images: [],
      },
      where: {
        id: product.id,
      },
    })
  }
}

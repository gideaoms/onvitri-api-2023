import { Product } from '@/core/product.js'
import { ProductRepository } from '@/core/repositories/product.js'
import { prisma } from '@/infra/libs/prisma.js'

class PrismaProductRepository implements ProductRepository {
  public async findManyByStore(storeId: string) {
    const limit = 10
    const products = await prisma.product.findMany({
      where: {
        store_id: storeId,
        status: 'active',
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    })
    return products.map(
      product => new Product({ id: product.id, description: product.description }),
    )
  }
}

export { PrismaProductRepository }

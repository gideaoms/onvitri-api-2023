import { Prisma } from '@prisma/client'
import { prisma } from '@/infra/libs/prisma.js'

export class FindProducts {
  public async exec(page: number) {
    const limit = 10
    const offset = limit * (page - 1)
    const where: Prisma.ProductWhereInput = {
      status: 'active',
      store: {
        status: 'active',
      },
    }
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      created_at: 'desc',
    }
    const products = await prisma.product.findMany({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: offset,
      include: {
        store: true,
      },
    })
    const hasMore = await prisma.product.count({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: limit * page,
    })
    return {
      data: products.map(product => ({
        id: product.id,
        description: product.description,
        store: {
          id: product.store.id,
          status: product.store.status,
        },
      })),
      hasMore: Boolean(hasMore),
    }
  }
}

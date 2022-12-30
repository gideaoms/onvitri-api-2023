import { Prisma } from '@prisma/client'
import { prisma } from '@/infra/libs/prisma.js'
import { failure, success } from '@/utils/either.js'
import { NotFoundError } from '@/core/errors/not-found.js'

export class FindProductsByStore {
  public async exec(storeId: string, page: number) {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        status: 'active',
      },
    })
    if (!store) {
      return failure(new NotFoundError('Store not found'))
    }
    const limit = 10
    const offset = limit * (page - 1)
    const where: Prisma.ProductWhereInput = {
      status: 'active',
      store: {
        id: storeId,
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
    })
    const hasMore = await prisma.product.count({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: limit * page,
    })
    return success({
      data: products.map(product => ({
        id: product.id,
        description: product.description,
      })),
      hasMore: Boolean(hasMore),
    })
  }
}

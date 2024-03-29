import { Prisma } from '@prisma/client'
import orm from '@/infra/libs/prisma.js'
import * as ProductMapper from '@/infra/mappers/product.js'
import * as StoreMapper from '@/infra/mappers/store.js'

export class Query {
  async exec(page: number) {
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
    const products = await orm.product.findMany({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: offset,
      include: {
        store: true,
      },
    })
    const hasMore = await orm.product.count({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: limit * page,
    })
    return {
      data: products.map(product => ({
        ...ProductMapper.toObject(product),
        store: StoreMapper.toObject(product.store),
      })),
      hasMore: Boolean(hasMore),
    }
  }
}

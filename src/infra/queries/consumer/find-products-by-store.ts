import { Prisma } from '@prisma/client'
import errors from 'http-errors'
import orm from '@/infra/libs/prisma.js'
import * as Either from '@/utils/either.js'
import * as ProductMapper from '@/infra/mappers/product.js'

export class Query {
  async exec(storeId: string, page: number) {
    const store = await orm.store.findFirst({
      where: {
        id: storeId,
        status: 'active',
      },
    })
    if (!store) {
      return Either.failure(new errors.NotFound('Store not found'))
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
    const products = await orm.product.findMany({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: offset,
    })
    const hasMore = await orm.product.count({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: limit * page,
    })
    return Either.success({
      data: products.map(ProductMapper.toObject),
      hasMore: Boolean(hasMore),
    })
  }
}

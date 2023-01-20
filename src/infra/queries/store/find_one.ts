import { Prisma } from '@prisma/client'
import errors from 'http-errors'
import orm from '@/infra/libs/prisma.js'
import * as Either from '@/utils/either.js'
import * as Mappers from '@/infra/mappers/mod.js'

export class Query {
  async exec(storeId: string) {
    const limit = 10
    const where: Prisma.StoreWhereInput = {
      id: storeId,
      status: 'active',
    }
    const orderBy: Prisma.StoreOrderByWithRelationInput = {
      created_at: 'desc',
    }
    const store = await orm.store.findFirst({
      where: where,
      orderBy: orderBy,
      include: {
        city: true,
        products: {
          where: {
            status: 'active',
          },
          orderBy: {
            created_at: 'desc',
          },
          take: limit,
        },
      },
    })
    if (!store) {
      return Either.failure(new errors.NotFound('Store not found'))
    }
    const page = 1
    const hasMore = await orm.product.count({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: limit * page,
    })
    return Either.success({
      ...Mappers.Store.toObject(store),
      city: Mappers.City.toObject(store.city),
      products: {
        data: store.products.map(Mappers.Product.toObject),
        hasMore: Boolean(hasMore),
      },
    })
  }
}

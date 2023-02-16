import { Prisma } from '@prisma/client'
import errors from 'http-errors'
import orm from '@/infra/libs/prisma.js'
import * as Either from '@/utils/either.js'
import * as StoreMapper from '@/infra/mappers/store.js'
import * as CityMapper from '@/infra/mappers/city.js'
import * as ProductMapper from '@/infra/mappers/product.js'

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
      ...StoreMapper.toObject(store),
      city: CityMapper.toObject(store.city),
      products: {
        data: store.products.map(ProductMapper.toObject),
        hasMore: Boolean(hasMore),
      },
    })
  }
}

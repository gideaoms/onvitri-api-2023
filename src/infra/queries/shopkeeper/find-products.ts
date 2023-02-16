import { Prisma } from '@prisma/client'
import orm from '@/infra/libs/prisma.js'
import * as GuardianProvider from '@/core/providers/guardian.js'
import * as Either from '@/utils/either.js'
import * as ProductMapper from '@/infra/mappers/product.js'
import * as StoreMapper from '@/infra/mappers/store.js'
import * as CityMapper from '@/infra/mappers/city.js'

export class Query {
  constructor(private readonly _guardianProvider: GuardianProvider.Provider) {}

  async exec(page: number, token: string) {
    const user = await this._guardianProvider.passThrough(token)
    if (Either.isFailure(user)) {
      return Either.failure(user.failure)
    }
    const limit = 10
    const offset = limit * (page - 1)
    const where: Prisma.ProductWhereInput = {
      store: {
        owner_id: user.success.id,
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
        store: {
          include: {
            city: true,
          },
        },
      },
    })
    const hasMore = await orm.product.count({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: limit * page,
    })
    return Either.success({
      data: products.map(product => ({
        ...ProductMapper.toObject(product),
        store: {
          ...StoreMapper.toObject(product.store),
          city: CityMapper.toObject(product.store.city),
        },
      })),
      hasMore: Boolean(hasMore),
    })
  }
}

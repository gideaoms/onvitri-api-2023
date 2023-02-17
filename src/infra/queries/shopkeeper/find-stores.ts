import { Prisma } from '@prisma/client'
import orm from '@/infra/libs/prisma.js'
import * as GuardianProvider from '@/core/providers/guardian.js'
import * as Either from '@/utils/either.js'
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
    const where: Prisma.StoreWhereInput = {
      owner_id: user.success.id,
    }
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      created_at: 'desc',
    }
    const stores = await orm.store.findMany({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: offset,
      include: {
        city: true,
      },
    })
    const hasMore = await orm.store.count({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: limit * page,
    })
    return Either.success({
      data: stores.map(store => ({
        ...StoreMapper.toObject(store),
        city: CityMapper.toObject(store.city),
      })),
      hasMore: Boolean(hasMore),
    })
  }
}

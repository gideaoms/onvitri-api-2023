import { Prisma } from '@prisma/client'
import orm from '@/infra/libs/prisma.js'
import * as StoreMapper from '@/infra/mappers/store.js'
import * as CityMapper from '@/infra/mappers/city.js'

export class Query {
  async exec(page: number) {
    const limit = 10
    const offset = limit * (page - 1)
    const where: Prisma.StoreWhereInput = {
      status: 'active',
    }
    const orderBy: Prisma.StoreOrderByWithRelationInput = {
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
    return {
      data: stores.map(store => ({
        ...StoreMapper.toObject(store),
        city: CityMapper.toObject(store.city),
      })),
      hasMore: Boolean(hasMore),
    }
  }
}

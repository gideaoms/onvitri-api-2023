import { Prisma } from '@prisma/client'
import { prisma } from '@/infra/libs/prisma.js'

export class FindStores {
  public async exec(page: number) {
    const limit = 10
    const offset = limit * (page - 1)
    const where: Prisma.StoreWhereInput = {
      status: 'active',
    }
    const orderBy: Prisma.StoreOrderByWithRelationInput = {
      created_at: 'desc',
    }
    const stores = await prisma.store.findMany({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: offset,
      include: {
        city: true,
      },
    })
    const hasMore = await prisma.store.count({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: limit * page,
    })
    return {
      data: stores.map(store => ({
        id: store.id,
        status: store.status,
        city: {
          id: store.city.id,
          name: store.city.name,
          initials: store.city.initials,
        },
      })),
      hasMore: hasMore,
    }
  }
}

import { StoreRepository } from '@/core/repositories/store.js'
import { prisma } from '@/infra/libs/prisma.js'
import { NotFoundError } from '@/core/errors/not-found.js'
import { failure, success } from '@/utils/either.js'
import { Store } from '@/core/store.js'

class PrismaStoreRepository implements StoreRepository {
  public async findOne(storeId: string) {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        status: 'active',
      },
      orderBy: {
        created_at: 'desc',
      },
    })
    if (!store) return failure(new NotFoundError('Store not found'))
    return success(new Store({ id: store.id, cityId: store.city_id, status: store.status }))
  }

  public async findMany(page: number) {
    const limit = 10
    const offset = limit * (page - 1)
    const stores = await prisma.store.findMany({
      where: {
        status: 'active',
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
    })
    return stores.map(
      store => new Store({ id: store.id, cityId: store.city_id, status: store.status }),
    )
  }
}

export { PrismaStoreRepository }

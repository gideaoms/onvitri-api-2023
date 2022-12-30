import { Store } from '@/core/entities/store.js'
import { NotFoundError } from '@/core/errors/not-found.js'
import { IStoreRepository } from '@/core/repositories/store.js'
import { prisma } from '@/infra/libs/prisma.js'
import { failure, success } from '@/utils/either.js'

export class StoreRepository implements IStoreRepository {
  public async findOne(storeId: string) {
    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
    })
    if (!store) {
      return failure(new NotFoundError('Store not found'))
    }
    return success(new Store({ id: store.id, cityId: store.city_id, status: store.status }))
  }
}

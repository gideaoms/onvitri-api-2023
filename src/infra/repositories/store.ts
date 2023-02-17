import errors from 'http-errors'
import orm from '@/infra/libs/prisma.js'
import * as StoreRepository from '@/core/repositories/store.js'
import * as Either from '@/utils/either.js'
import * as StoreMapper from '@/infra/mappers/store.js'

export class Repository implements StoreRepository.Repository {
  async findOne(storeId: string) {
    const store = await orm.store.findUnique({
      where: {
        id: storeId,
      },
      include: {
        city: true,
      },
    })
    if (!store) {
      return Either.failure(new errors.NotFound('Store not found'))
    }
    return Either.success(StoreMapper.toModel(store))
  }
}

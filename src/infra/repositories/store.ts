import errors from 'http-errors'
import orm from '@/infra/libs/prisma.js'
import * as Repositories from '@/core/repositories/mod.js'
import * as Either from '@/utils/either.js'
import * as Mappers from '@/infra/mappers/mod.js'

export class Repository implements Repositories.Store.Repository {
  async findOne(storeId: string) {
    const store = await orm.store.findUnique({
      where: {
        id: storeId,
      },
    })
    if (!store) {
      return Either.failure(new errors.NotFound('Store not found'))
    }
    return Either.success(Mappers.Store.toModel(store))
  }
}

import errors from 'http-errors'
import orm from '@/infra/libs/prisma.js'
import * as GuardianProvider from '@/core/providers/guardian.js'
import * as Either from '@/utils/either.js'
import * as ProductMapper from '@/infra/mappers/product.js'
import * as StoreMapper from '@/infra/mappers/store.js'
import * as CityMapper from '@/infra/mappers/city.js'

export class Query {
  constructor(private readonly _guardianProvider: GuardianProvider.Provider) {}

  async exec(productId: string, token: string) {
    const user = await this._guardianProvider.passThrough(token)
    if (Either.isFailure(user)) {
      return Either.failure(user.failure)
    }
    const product = await orm.product.findFirst({
      where: {
        id: productId,
        store: {
          owner_id: user.success.id,
        },
      },
      include: {
        store: {
          include: {
            city: true,
          },
        },
      },
    })
    if (!product) {
      return Either.failure(new errors.NotFound('Product not found'))
    }
    return Either.success({
      ...ProductMapper.toObject(product),
      store: {
        ...StoreMapper.toObject(product.store),
        city: CityMapper.toObject(product.store.city),
      },
    })
  }
}

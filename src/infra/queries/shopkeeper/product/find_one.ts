import orm from '@/infra/libs/prisma.js'
import * as Errors from '@/core/errors/mod.js'
import * as Providers from '@/core/providers/mod.js'
import * as Either from '@/utils/either.js'
import * as Mappers from '@/infra/mappers/mod.js'

export class Query {
  constructor(private readonly _guardianProvider: Providers.Guardian.Provider) {}

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
      return Either.failure(new Errors.NotFound.Error('Product not found'))
    }
    return Either.success({
      ...Mappers.Product.toObject(product),
      store: {
        ...Mappers.Store.toObject(product.store),
        city: Mappers.City.toObject(product.store.city),
      },
    })
  }
}

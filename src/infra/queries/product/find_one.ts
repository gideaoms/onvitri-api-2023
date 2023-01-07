import orm from '@/infra/libs/prisma.js'
import * as Errors from '@/core/errors/mod.js'
import * as Either from '@/utils/either.js'
import * as Mappers from '@/infra/mappers/mod.js'

export class Query {
  async exec(productId: string) {
    const product = await orm.product.findFirst({
      where: {
        id: productId,
        status: 'active',
        store: {
          status: 'active',
        },
      },
      include: {
        store: true,
      },
    })
    if (!product) {
      return Either.failure(new Errors.NotFound.Error('Product not found'))
    }
    return Either.success({
      ...Mappers.Product.toObject(product),
      store: Mappers.Store.toObject(product.store),
    })
  }
}

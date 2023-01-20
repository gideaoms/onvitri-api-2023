import errors from 'http-errors'
import orm from '@/infra/libs/prisma.js'
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
      return Either.failure(new errors.NotFound('Product not found'))
    }
    return Either.success({
      ...Mappers.Product.toObject(product),
      store: Mappers.Store.toObject(product.store),
    })
  }
}

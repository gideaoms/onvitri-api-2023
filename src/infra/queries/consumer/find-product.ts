import errors from 'http-errors'
import orm from '@/infra/libs/prisma.js'
import * as Either from '@/utils/either.js'
import * as ProductMapper from '@/infra/mappers/product.js'
import * as StoreMapper from '@/infra/mappers/store.js'

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
      ...ProductMapper.toObject(product),
      store: StoreMapper.toObject(product.store),
    })
  }
}

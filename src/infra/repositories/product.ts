import errors from 'http-errors'
import orm from '@/infra/libs/prisma.js'
import * as Models from '@/core/models/mod.js'
import * as Repositories from '@/core/repositories/mod.js'
import * as Either from '@/utils/either.js'
import * as Mappers from '@/infra/mappers/mod.js'

export class Repository implements Repositories.Product.Repository {
  async findOne(productId: string, ownerId: string) {
    const product = await orm.product.findFirst({
      where: {
        id: productId,
        store: {
          owner_id: ownerId,
        },
      },
    })
    if (!product) {
      return Either.failure(new errors.NotFound('Product not found'))
    }
    return Either.success(Mappers.Product.toModel(product))
  }

  async remove(product: Models.Product.Model) {
    await orm.product.delete({
      where: {
        id: product.id,
      },
    })
  }

  async create(product: Models.Product.Model) {
    const created = await orm.product.create({
      data: Mappers.Product.fromModel(product),
    })
    return Mappers.Product.toModel(created)
  }

  async update(product: Models.Product.Model) {
    const updated = await orm.product.update({
      data: Mappers.Product.fromModel(product),
      where: {
        id: product.id,
      },
    })
    return Mappers.Product.toModel(updated)
  }
}

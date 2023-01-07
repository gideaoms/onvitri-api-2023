import orm from '@/infra/libs/prisma.js'
import * as Models from '@/core/models/mod.js'
import * as Errors from '@/core/errors/mod.js'
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
      return Either.failure(new Errors.NotFound.Error('Product not found'))
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
      data: {
        id: product.id,
        store_id: product.storeId,
        description: product.description,
        status: product.status,
        images: [],
      },
    })
    return Mappers.Product.toModel(created)
  }

  async update(product: Models.Product.Model) {
    const updated = await orm.product.update({
      data: {
        id: product.id,
        store_id: product.storeId,
        description: product.description,
        status: product.status,
        images: [],
      },
      where: {
        id: product.id,
      },
    })
    return Mappers.Product.toModel(updated)
  }
}

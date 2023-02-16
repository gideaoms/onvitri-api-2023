import errors from 'http-errors'
import orm from '@/infra/libs/prisma.js'
import * as ProductModel from '@/core/models/product.js'
import * as ProductRepository from '@/core/repositories/product.js'
import * as Either from '@/utils/either.js'
import * as ProductMapper from '@/infra/mappers/product.js'

export class Repository implements ProductRepository.Repository {
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
    return Either.success(ProductMapper.toModel(product))
  }

  async remove(product: ProductModel.Model) {
    await orm.product.delete({
      where: {
        id: product.id,
      },
    })
  }

  async create(product: ProductModel.Model) {
    const created = await orm.product.create({
      data: ProductMapper.fromModel(product),
    })
    return ProductMapper.toModel(created)
  }

  async update(product: ProductModel.Model) {
    const updated = await orm.product.update({
      data: ProductMapper.fromModel(product),
      where: {
        id: product.id,
      },
    })
    return ProductMapper.toModel(updated)
  }
}

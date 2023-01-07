import * as Models from '@/core/models/mod.js'
import * as Errors from '@/core/errors/mod.js'
import * as Providers from '@/core/providers/mod.js'
import * as Repositories from '@/core/repositories/mod.js'
import * as Either from '@/utils/either.js'
import * as Mappers from '@/core/mappers/mod.js'

type Body = {
  productId: string
  description: string
  status: Models.Product.Status
}

export class Service {
  constructor(
    private readonly _guardianProvider: Providers.Guardian.Provider,
    private readonly _productRepository: Repositories.Product.Repository,
  ) {}

  async exec(body: Body, token: string) {
    const user = await this._guardianProvider.passThrough(token)
    if (Either.isFailure(user)) {
      return Either.failure(user.failure)
    }
    const found = await this._productRepository.findOne(body.productId, user.success.id)
    if (Either.isFailure(found)) {
      return Either.failure(found.failure)
    }
    const product = new Models.Product.Model({
      id: found.success.id,
      storeId: found.success.storeId,
      description: body.description,
      images: found.success.images,
      status: body.status,
    })
    if (product.isActive() && !product.hasImages()) {
      return Either.failure(
        new Errors.BadRequest.Error('You cannot save a product without an image'),
      )
    }
    if (product.isActive() && product.hasMoreImagesThanAllowed()) {
      return Either.failure(
        new Errors.BadRequest.Error('Your product has more images than allowed'),
      )
    }
    const updated = await this._productRepository.update(product)
    return Either.success(Mappers.Product.toObject(updated))
  }
}

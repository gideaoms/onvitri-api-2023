import errors from 'http-errors'
import * as Either from '@/utils/either.js'
import * as Repositories from '@/core/repositories/mod.js'
import * as Providers from '@/core/providers/mod.js'
import * as Models from '@/core/models/mod.js'
import * as Mappers from '@/core/mappers/mod.js'

type Body = {
  storeId: string
  description: string
  status: Models.Product.Status
  images: Array<{
    id: string
    variants: Array<{
      url: string
      name: string
      ext: string
      width: number
      height: number
      size: 'mini' | 'normal'
      bucket: string
    }>
  }>
}

export class Service {
  constructor(
    private readonly _storeRepository: Repositories.Store.Repository,
    private readonly _guardianProvider: Providers.Guardian.Provider,
    private readonly _productRepository: Repositories.Product.Repository,
  ) {}

  async exec(body: Body, token: string) {
    const user = await this._guardianProvider.passThrough(token)
    if (Either.isFailure(user)) {
      return Either.failure(user.failure)
    }
    const store = await this._storeRepository.findOne(body.storeId)
    if (Either.isFailure(store)) {
      return Either.failure(store.failure)
    }
    const product = Models.Product.build({
      id: undefined!,
      storeId: body.storeId,
      description: body.description,
      status: body.status,
      images: body.images.map(image =>
        Models.Image.build({
          id: image.id,
          variants: image.variants.map(variant =>
            Models.Variant.build({
              url: variant.url,
              name: variant.name,
              ext: variant.ext,
              width: variant.width,
              height: variant.height,
              size: variant.size,
              bucket: variant.bucket,
            }),
          ),
        }),
      ),
    })
    if (Models.Product.isActive(product) && !Models.Product.hasImages(product)) {
      return Either.failure(new errors.BadRequest('You cannot publish a product without an image'))
    }
    if (Models.Product.isActive(product) && Models.Product.hasMoreImagesThanAllowed(product)) {
      return Either.failure(new errors.BadRequest('Your product has more images than allowed'))
    }
    const created = await this._productRepository.create(product)
    return Either.success(Mappers.Product.toObject(created))
  }
}

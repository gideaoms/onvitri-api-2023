import errors from 'http-errors'
import * as Either from '@/utils/either.js'
import * as StoreRepository from '@/core/repositories/store.js'
import * as ProductRepository from '@/core/repositories/product.js'
import * as GuardianProvider from '@/core/providers/guardian.js'
import * as ProductModel from '@/core/models/product.js'
import * as ImageModel from '@/core/models/image.js'
import * as VariantModel from '@/core/models/variant.js'
import * as ProductMapper from '@/core/mappers/product.js'

type Body = {
  storeId: string
  description: string
  status: ProductModel.Status
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
    private readonly _storeRepository: StoreRepository.Repository,
    private readonly _guardianProvider: GuardianProvider.Provider,
    private readonly _productRepository: ProductRepository.Repository,
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
    const product = ProductModel.build({
      id: undefined!,
      storeId: body.storeId,
      description: body.description,
      status: body.status,
      images: body.images.map(image =>
        ImageModel.build({
          id: image.id,
          variants: image.variants.map(variant =>
            VariantModel.build({
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
    if (ProductModel.isActive(product) && !ProductModel.hasImage(product)) {
      return Either.failure(
        new errors.BadRequest('You cannot publish a product without an image'),
      )
    }
    if (
      ProductModel.isActive(product) &&
      ProductModel.hasMoreImageThanAllowed(product)
    ) {
      return Either.failure(
        new errors.BadRequest('Your product has more images than allowed'),
      )
    }
    const created = await this._productRepository.create(product)
    return Either.success(ProductMapper.toObject(created))
  }
}

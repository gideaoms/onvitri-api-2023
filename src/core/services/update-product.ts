import errors from 'http-errors'
import * as ProductModel from '@/core/models/product.js'
import * as ImageModel from '@/core/models/image.js'
import * as VariantModel from '@/core/models/variant.js'
import * as GuardianProvider from '@/core/providers/guardian.js'
import * as ProductRepository from '@/core/repositories/product.js'
import * as Either from '@/utils/either.js'
import * as ProductMapper from '@/core/mappers/product.js'

type Body = {
  productId: string
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
    private readonly _guardianProvider: GuardianProvider.Provider,
    private readonly _productRepository: ProductRepository.Repository,
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
    const product = ProductModel.build({
      id: found.success.id,
      storeId: found.success.storeId,
      description: body.description,
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
      status: body.status,
    })
    if (ProductModel.isActive(product) && !ProductModel.hasImage(product)) {
      return Either.failure(new errors.BadRequest('You cannot publish a product without an image'))
    }
    if (ProductModel.isActive(product) && ProductModel.hasMoreImageThanAllowed(product)) {
      return Either.failure(new errors.BadRequest('Your product has more images than allowed'))
    }
    const updated = await this._productRepository.update(product)
    return Either.success(ProductMapper.toObject(updated))
  }
}

import { Product } from '@/core/entities/product.js'
import { BadRequestError } from '@/core/errors/bad-request.js'
import { IGuardianProvider } from '@/core/providers/guardian.js'
import { IProductRepository } from '@/core/repositories/product.js'
import { failure, isFailure, success } from '@/utils/either.js'

export class UpdateProduct {
  private readonly guardianProvider: IGuardianProvider
  private readonly productRepository: IProductRepository

  public constructor(guardianProvider: IGuardianProvider, productRepository: IProductRepository) {
    this.guardianProvider = guardianProvider
    this.productRepository = productRepository
  }

  public async exec(
    body: { productId: string; description: string; status: Product.Status },
    token: string,
  ) {
    const user = await this.guardianProvider.passThrough(token)
    if (isFailure(user)) {
      return failure(user.failure)
    }
    const found = await this.productRepository.findOne(body.productId, user.success.id)
    if (isFailure(found)) {
      return failure(found.failure)
    }
    const product = new Product({
      id: found.success.id,
      storeId: found.success.storeId,
      description: body.description,
      images: found.success.images,
      status: body.status,
    })
    if (product.isActive() && !product.hasImages()) {
      return failure(new BadRequestError('You cannot save a product without an image'))
    }
    if (product.isActive() && product.hasMoreImagesThanAllowed()) {
      return failure(new BadRequestError('Your product has more images than allowed'))
    }
    await this.productRepository.update(product)
    return success(null)
  }
}

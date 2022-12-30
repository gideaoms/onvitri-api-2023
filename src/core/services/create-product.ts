import { Product } from '@/core/entities/product.js'
import { BadRequestError } from '@/core/errors/bad-request.js'
import { IGuardianProvider } from '@/core/providers/guardian.js'
import { IProductRepository } from '@/core/repositories/product.js'
import { IStoreRepository } from '@/core/repositories/store.js'
import { failure, isFailure, success } from '@/utils/either.js'

export class CreateProduct {
  private readonly storeRepository: IStoreRepository
  private readonly guardianProvider: IGuardianProvider
  private readonly productRepository: IProductRepository

  public constructor(
    storeRepository: IStoreRepository,
    guardianProvider: IGuardianProvider,
    productRepository: IProductRepository,
  ) {
    this.storeRepository = storeRepository
    this.guardianProvider = guardianProvider
    this.productRepository = productRepository
  }

  public async exec(
    body: {
      storeId: string
      description: string
      status: Product.Status
    },
    token: string,
  ) {
    const user = await this.guardianProvider.passThrough(token)
    if (isFailure(user)) {
      return failure(user.failure)
    }
    const store = await this.storeRepository.findOne(body.storeId)
    if (isFailure(store)) {
      return failure(store.failure)
    }
    const product = new Product({
      id: undefined!,
      storeId: body.storeId,
      description: body.description,
      status: body.status,
      images: [],
    })
    if (product.isActive() && !product.hasImages()) {
      return failure(new BadRequestError('You cannot save a product without an image'))
    }
    if (product.isActive() && product.hasMoreImagesThanAllowed()) {
      return failure(new BadRequestError('Your product has more images than allowed'))
    }
    const productId = await this.productRepository.create(product)
    return success({ id: productId })
  }
}

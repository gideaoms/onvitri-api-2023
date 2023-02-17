import * as GuardianProvider from '@/core/providers/guardian.js'
import * as StorageProvider from '@/core/providers/storage.js'
import * as ProductRepository from '@/core/repositories/product.js'
import * as Either from '@/utils/either.js'

export class Service {
  constructor(
    private readonly _productRepository: ProductRepository.Repository,
    private readonly _guardianProvider: GuardianProvider.Provider,
    private readonly _storageProvider: StorageProvider.Provider,
  ) {}

  async exec(productId: string, token: string) {
    const user = await this._guardianProvider.passThrough(token)
    if (Either.isFailure(user)) {
      return Either.failure(user.failure)
    }
    const product = await this._productRepository.findOne(
      productId,
      user.success.id,
    )
    if (Either.isFailure(product)) {
      return Either.failure(product.failure)
    }
    await this._productRepository.remove(product.success)
    const variants = product.success.images.flatMap(image => image.variants)
    await Promise.all(
      variants.map(variant => this._storageProvider.remove(variant)),
    )
    return Either.success(null)
  }
}

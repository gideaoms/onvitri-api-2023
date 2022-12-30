import { IGuardianProvider } from '@/core/providers/guardian.js'
import { IProductRepository } from '@/core/repositories/product.js'
import { failure, isFailure, success } from '@/utils/either.js'

export class RemoveProduct {
  private readonly productRepository: IProductRepository
  private readonly guardianProvider: IGuardianProvider

  public constructor(productRepository: IProductRepository, guardianProvider: IGuardianProvider) {
    this.productRepository = productRepository
    this.guardianProvider = guardianProvider
  }

  public async exec(productId: string, token: string) {
    const user = await this.guardianProvider.passThrough(token)
    if (isFailure(user)) {
      return failure(user.failure)
    }
    const product = await this.productRepository.findOne(productId, user.success.id)
    if (isFailure(product)) {
      return failure(product.failure)
    }
    await this.productRepository.remove(product.success)
    return success(null)
  }
}

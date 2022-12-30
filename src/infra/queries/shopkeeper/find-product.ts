import { NotFoundError } from '@/core/errors/not-found.js'
import { IGuardianProvider } from '@/core/providers/guardian.js'
import { prisma } from '@/infra/libs/prisma.js'
import { failure, isFailure, success } from '@/utils/either.js'

export class FindProduct {
  private readonly guardianProvider: IGuardianProvider

  public constructor(guardianProvider: IGuardianProvider) {
    this.guardianProvider = guardianProvider
  }

  public async exec(productId: string, token: string) {
    const user = await this.guardianProvider.passThrough(token)
    if (isFailure(user)) {
      return failure(user.failure)
    }
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          owner_id: user.success.id,
        },
      },
      include: {
        store: {
          include: {
            city: true,
          },
        },
      },
    })
    if (!product) return failure(new NotFoundError('Product not found'))
    return success({
      id: product.id,
      description: product.description,
      store: {
        id: product.store.id,
        status: product.store.status,
        city: {
          id: product.store.city.id,
          name: product.store.city.name,
          initials: product.store.city.initials,
        },
      },
    })
  }
}

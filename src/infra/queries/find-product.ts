import { NotFoundError } from '@/core/errors/not-found.js'
import { prisma } from '@/infra/libs/prisma.js'
import { failure, success } from '@/utils/either.js'

export class FindProduct {
  public async exec(productId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        status: 'active',
        store: {
          status: 'active',
        },
      },
      include: {
        store: true,
      },
    })
    if (!product) return failure(new NotFoundError('Product not found'))
    return success({
      id: product.id,
      description: product.description,
      store: {
        id: product.store.id,
        status: product.store.status,
      },
    })
  }
}

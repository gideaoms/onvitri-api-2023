import { Prisma } from '@prisma/client'
import { IGuardianProvider } from '@/core/providers/guardian.js'
import { failure, isFailure, success } from '@/utils/either.js'
import { prisma } from '@/infra/libs/prisma.js'

export class FindProducts {
  private readonly guardianProvider: IGuardianProvider

  public constructor(guardianProvider: IGuardianProvider) {
    this.guardianProvider = guardianProvider
  }

  public async exec(page: number, token: string) {
    const user = await this.guardianProvider.passThrough(token)
    if (isFailure(user)) {
      return failure(user.failure)
    }
    const limit = 10
    const offset = limit * (page - 1)
    const where: Prisma.ProductWhereInput = {
      store: {
        owner_id: user.success.id,
      },
    }
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      created_at: 'desc',
    }
    const products = await prisma.product.findMany({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: offset,
      include: {
        store: {
          include: {
            city: true,
          },
        },
      },
    })
    const hasMore = await prisma.product.count({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: limit * page,
    })
    return success({
      data: products.map(product => ({
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
      })),
      hasMore: Boolean(hasMore),
    })
  }
}

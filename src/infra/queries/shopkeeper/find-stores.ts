import { Prisma } from '@prisma/client'
import { prisma } from '@/infra/libs/prisma.js'
import { IGuardianProvider } from '@/core/providers/guardian.js'
import { failure, isFailure, success } from '@/utils/either.js'

export class FindStores {
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
    const where: Prisma.StoreWhereInput = {
      owner_id: user.success.id,
    }
    const orderBy: Prisma.StoreOrderByWithRelationInput = {
      created_at: 'desc',
    }
    const stores = await prisma.store.findMany({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: offset,
      include: {
        city: true,
      },
    })
    const hasMore = await prisma.store.count({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: limit * page,
    })
    return success({
      data: stores.map(store => ({
        id: store.id,
        status: store.status,
        city: {
          id: store.city.id,
          name: store.city.name,
          initials: store.city.initials,
        },
      })),
      hasMore: Boolean(hasMore),
    })
  }
}

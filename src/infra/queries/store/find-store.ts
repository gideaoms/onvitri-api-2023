import { Prisma } from '@prisma/client'
import { NotFoundError } from '@/core/errors/not-found.js'
import { prisma } from '@/infra/libs/prisma.js'
import { failure, success } from '@/utils/either.js'

async function findStore(storeId: string) {
  const limit = 10
  const where: Prisma.StoreWhereInput = {
    id: storeId,
    status: 'active',
  }
  const orderBy: Prisma.StoreOrderByWithRelationInput = {
    created_at: 'desc',
  }
  const store = await prisma.store.findFirst({
    where: where,
    orderBy: orderBy,
    include: {
      city: true,
      products: {
        where: {
          status: 'active',
        },
        orderBy: {
          created_at: 'desc',
        },
        take: limit,
      },
    },
  })
  if (!store) return failure(new NotFoundError('Store not found'))
  const page = 1
  const hasMore = await prisma.product.count({
    where: where,
    orderBy: orderBy,
    take: limit,
    skip: limit * page,
  })
  return success({
    id: store.id,
    status: store.status,
    city: {
      id: store.city.id,
      name: store.city.name,
      initials: store.city.initials,
    },
    products: {
      data: store.products.map(product => ({
        id: product.id,
        description: product.description,
      })),
      hasMore: Boolean(hasMore),
    },
  })
}

export { findStore }

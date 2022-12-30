import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { CreateProduct } from '@/core/services/create-product.js'
import { StoreRepository } from '@/infra/repositories/store.js'
import { TokenProvider } from '@/infra/providers/token.js'
import { UserRepository } from '@/infra/repositories/user.js'
import { GuardianProvider } from '@/infra/providers/guardian.js'
import { ProductRepository } from '@/infra/repositories/product.js'
import { isFailure } from '@/utils/either.js'

const tokenProvider = new TokenProvider()
const userRepository = new UserRepository()
const guardianProvider = new GuardianProvider(tokenProvider, userRepository)
const storeRepository = new StoreRepository()
const productRepository = new ProductRepository()
const createProduct = new CreateProduct(storeRepository, guardianProvider, productRepository)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products',
    method: 'POST',
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      body: Type.Object({
        store_id: Type.String({ format: 'uuid' }),
        description: Type.String({ minLength: 1 }),
        status: Type.Enum({ active: 'active' as const, inactive: 'inactive' as const }),
        pictures: Type.Array(
          Type.Object({
            id: Type.String({ format: 'uuid' }),
            variants: Type.Array(
              Type.Object({
                url: Type.String({ format: 'uri' }),
                ext: Type.String(),
                name: Type.String(),
                size: Type.Enum({ sm: 'sm' as const, md: 'md' as const }),
                width: Type.Integer(),
                height: Type.Integer(),
              }),
            ),
          }),
        ),
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
        }),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const token = request.headers.authorization
      const body = {
        description: request.body.description,
        status: request.body.status,
        storeId: request.body.store_id,
        urlImage: '',
      }
      const result = await createProduct.exec(body, token)
      if (isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send(result.success)
    },
  })
}

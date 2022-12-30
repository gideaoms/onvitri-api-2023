import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { UpdateProduct } from '@/core/services/update-product.js'
import { TokenProvider } from '@/infra/providers/token.js'
import { UserRepository } from '@/infra/repositories/user.js'
import { GuardianProvider } from '@/infra/providers/guardian.js'
import { ProductRepository } from '@/infra/repositories/product.js'
import { isFailure } from '@/utils/either.js'

const tokenProvider = new TokenProvider()
const userRepository = new UserRepository()
const guardianProvider = new GuardianProvider(tokenProvider, userRepository)
const productRepository = new ProductRepository()
const updateProduct = new UpdateProduct(guardianProvider, productRepository)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products/:product_id',
    method: 'PUT',
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      params: Type.Object({
        product_id: Type.String({ format: 'uuid' }),
      }),
      body: Type.Object({
        description: Type.String(),
        status: Type.Enum({ active: 'active' as const, inactive: 'inactive' as const }),
        images: Type.Array(
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
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const token = request.headers.authorization
      const body = {
        productId: request.params.product_id,
        description: request.body.description,
        status: request.body.status,
      }
      const result = await updateProduct.exec(body, token)
      if (isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send()
    },
  })
}

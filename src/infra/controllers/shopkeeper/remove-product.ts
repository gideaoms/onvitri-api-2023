import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { RemoveProduct } from '@/core/services/remove-product.js'
import { ProductRepository } from '@/infra/repositories/product.js'
import { isFailure } from '@/utils/either.js'
import { GuardianProvider } from '@/infra/providers/guardian.js'
import { TokenProvider } from '@/infra/providers/token.js'
import { UserRepository } from '@/infra/repositories/user.js'

const productRepository = new ProductRepository()
const tokenProvider = new TokenProvider()
const userRepository = new UserRepository()
const guardianProvider = new GuardianProvider(tokenProvider, userRepository)
const removeProduct = new RemoveProduct(productRepository, guardianProvider)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products/:product_id',
    method: 'DELETE',
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      params: Type.Object({
        product_id: Type.String({ format: 'uuid' }),
      }),
      response: {
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const token = request.headers.authorization
      const productId = request.params.product_id
      const result = await removeProduct.exec(productId, token)
      if (isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send()
    },
  })
}

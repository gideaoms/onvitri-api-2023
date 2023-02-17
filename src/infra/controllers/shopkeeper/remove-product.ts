import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as RemoveProduct from '@/core/services/remove-product.js'
import * as StorageProvider from '@/infra/providers/storage.js'
import * as TokenProvider from '@/infra/providers/token.js'
import * as GuardianProvider from '@/infra/providers/guardian.js'
import * as UserRepository from '@/infra/repositories/user.js'
import * as ProductRepository from '@/infra/repositories/product.js'
import * as Either from '@/utils/either.js'

const productRepository = new ProductRepository.Repository()
const tokenProvider = new TokenProvider.Provider()
const userRepository = new UserRepository.Repository()
const guardianProvider = new GuardianProvider.Provider(
  tokenProvider,
  userRepository,
)
const storageProvider = new StorageProvider.Provider()
const removeProduct = new RemoveProduct.Service(
  productRepository,
  guardianProvider,
  storageProvider,
)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/shopkeeper/products/:product_id',
    method: 'DELETE',
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      params: Type.Object({
        product_id: Type.String({ format: 'uuid' }),
      }),
    },
    async handler(request, replay) {
      const token = request.headers.authorization
      const productId = request.params.product_id
      const result = await removeProduct.exec(productId, token)
      if (Either.isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send()
    },
  })
}

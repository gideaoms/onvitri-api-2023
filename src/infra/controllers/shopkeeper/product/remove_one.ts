import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as Services from '@/core/services/mod.js'
import * as Providers from '@/infra/providers/mod.js'
import * as Repositories from '@/infra/repositories/mod.js'
import * as Either from '@/utils/either.js'

const productRepository = new Repositories.Product.Repository()
const tokenProvider = new Providers.Token.Provider()
const userRepository = new Repositories.User.Repository()
const guardianProvider = new Providers.Guardian.Provider(tokenProvider, userRepository)
const storageProvider = new Providers.Storage.Provider()
const removeProduct = new Services.Product.RemoveOne.Service(
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

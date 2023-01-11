import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as Services from '@/core/services/mod.js'
import * as Providers from '@/infra/providers/mod.js'
import * as Repositories from '@/infra/repositories/mod.js'
import * as Either from '@/utils/either.js'

const tokenProvider = new Providers.Token.Provider()
const userRepository = new Repositories.User.Repository()
const guardianProvider = new Providers.Guardian.Provider(tokenProvider, userRepository)
const storeRepository = new Repositories.Store.Repository()
const productRepository = new Repositories.Product.Repository()
const createProduct = new Services.Product.CreateOne.Service(
  storeRepository,
  guardianProvider,
  productRepository,
)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/shopkeeper/products',
    method: 'POST',
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      body: Type.Object({
        store_id: Type.String({ format: 'uuid' }),
        description: Type.String({ minLength: 1 }),
        status: Type.Enum({ active: 'active' as const, inactive: 'inactive' as const }),
        images: Type.Array(
          Type.Object({
            id: Type.String({ format: 'uuid' }),
            variants: Type.Array(
              Type.Object({
                url: Type.String({ format: 'uri' }),
                ext: Type.String(),
                name: Type.String(),
                width: Type.Integer(),
                height: Type.Integer(),
                size: Type.Enum({ mini: 'mini' as const, normal: 'normal' as const }),
                bucket: Type.String(),
              }),
            ),
          }),
        ),
      }),
    },
    async handler(request, replay) {
      const token = request.headers.authorization
      const body = {
        description: request.body.description,
        status: request.body.status,
        storeId: request.body.store_id,
        images: request.body.images,
      }
      const result = await createProduct.exec(body, token)
      if (Either.isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send(result.success)
    },
  })
}

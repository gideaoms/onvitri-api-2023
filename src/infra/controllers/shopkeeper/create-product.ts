import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as CreateProduct from '@/core/services/create-product.js'
import * as TokenProvider from '@/infra/providers/token.js'
import * as GuardianProvider from '@/infra/providers/guardian.js'
import * as UserRepository from '@/infra/repositories/user.js'
import * as StoreRepository from '@/infra/repositories/store.js'
import * as ProductRepository from '@/infra/repositories/product.js'
import * as Either from '@/utils/either.js'

const tokenProvider = new TokenProvider.Provider()
const userRepository = new UserRepository.Repository()
const guardianProvider = new GuardianProvider.Provider(
  tokenProvider,
  userRepository,
)
const storeRepository = new StoreRepository.Repository()
const productRepository = new ProductRepository.Repository()
const createProduct = new CreateProduct.Service(
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
        status: Type.Enum({
          active: 'active' as const,
          inactive: 'inactive' as const,
        }),
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
                size: Type.Enum({
                  mini: 'mini' as const,
                  normal: 'normal' as const,
                }),
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

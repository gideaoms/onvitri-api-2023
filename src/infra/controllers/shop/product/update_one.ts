import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as Services from '@/core/services/product/mod.js'
import * as Providers from '@/infra/providers/mod.js'
import * as Repositories from '@/infra/repositories/mod.js'
import * as Either from '@/utils/either.js'

const tokenProvider = new Providers.Token.Provider()
const userRepository = new Repositories.User.Repository()
const guardianProvider = new Providers.Guardian.Provider(tokenProvider, userRepository)
const productRepository = new Repositories.Product.Repository()
const updateProduct = new Services.UpdateOne.Service(guardianProvider, productRepository)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/shop/products/:product_id',
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
    },
    async handler(request, replay) {
      const token = request.headers.authorization
      const body = {
        productId: request.params.product_id,
        description: request.body.description,
        status: request.body.status,
        images: request.body.images,
      }
      const result = await updateProduct.exec(body, token)
      if (Either.isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send(result.success)
    },
  })
}

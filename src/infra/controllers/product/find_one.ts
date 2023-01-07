import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as Queries from '@/infra/queries/mod.js'
import * as Either from '@/utils/either.js'

const findProduct = new Queries.Product.FindOne.Query()

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products/:product_id',
    method: 'GET',
    schema: {
      params: Type.Object({
        product_id: Type.String({ format: 'uuid' }),
      }),
    },
    async handler(request, replay) {
      const productId = request.params.product_id
      const result = await findProduct.exec(productId)
      if (Either.isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send(result.success)
    },
  })
}

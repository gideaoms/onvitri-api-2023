import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as FindProducts from '@/infra/queries/consumer/find-products.js'

const findProducts = new FindProducts.Query()

export default async function Product(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/consumer/products',
    method: 'GET',
    schema: {
      querystring: Type.Object({
        page: Type.Number(),
      }),
    },
    async handler(request, replay) {
      const page = request.query.page
      const result = await findProducts.exec(page)
      return replay.header('x-has-more', result.hasMore).send(result.data)
    },
  })
}

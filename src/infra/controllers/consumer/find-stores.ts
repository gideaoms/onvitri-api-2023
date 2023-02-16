import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as FindStores from '@/infra/queries/consumer/find-stores.js'

const findStores = new FindStores.Query()

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/consumer/stores',
    method: 'GET',
    schema: {
      querystring: Type.Object({
        page: Type.Number(),
      }),
    },
    async handler(request, replay) {
      const page = request.query.page
      const result = await findStores.exec(page)
      return replay.header('x-has-more', result.hasMore).send(result.data)
    },
  })
}

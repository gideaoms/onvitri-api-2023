import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as Queries from '@/infra/queries/mod.js'

const findStores = new Queries.Store.FindMany.Query()

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/stores',
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

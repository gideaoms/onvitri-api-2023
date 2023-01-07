import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as Either from '@/utils/either.js'
import * as Queries from '@/infra/queries/mod.js'

const findStore = new Queries.Store.FindOne.Query()

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/stores/:store_id',
    method: 'GET',
    schema: {
      params: Type.Object({
        store_id: Type.String({ format: 'uuid' }),
      }),
    },
    async handler(request, replay) {
      const storeId = request.params.store_id
      const result = await findStore.exec(storeId)
      if (Either.isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay
        .header('x-has-more', result.success.products.hasMore)
        .send({ ...result.success, products: result.success.products.data })
    },
  })
}

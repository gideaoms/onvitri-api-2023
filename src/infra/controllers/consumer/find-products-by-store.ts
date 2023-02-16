import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as FindProductsByStore from '@/infra/queries/consumer/find-products-by-store.js'
import * as Either from '@/utils/either.js'

const findProductsByStore = new FindProductsByStore.Query()

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/consumer/stores/:store_id/products',
    method: 'GET',
    schema: {
      params: Type.Object({
        store_id: Type.String({ format: 'uuid' }),
      }),
      querystring: Type.Object({
        page: Type.Number(),
      }),
    },
    async handler(request, replay) {
      const page = request.query.page
      const storeId = request.params.store_id
      const result = await findProductsByStore.exec(storeId, page)
      if (Either.isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.header('x-has-more', result.success.hasMore).send(result.success.data)
    },
  })
}

import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { FindProductsByStore } from '@/infra/queries/find-products-by-store.js'
import { isFailure } from '@/utils/either.js'

const findProductsByStore = new FindProductsByStore()

export async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/stores/:store_id/products',
    method: 'GET',
    schema: {
      params: Type.Object({
        store_id: Type.String({ format: 'uuid' }),
      }),
      querystring: Type.Object({
        page: Type.Number(),
      }),
      response: {
        200: Type.Array(
          Type.Object({
            id: Type.String(),
            // store_id: Type.String(),
            // title: Type.String(),
            description: Type.String(),
            // price: Type.Integer(),
            // status: Type.String(),
            // pictures: Type.Array(
            //   Type.Object({
            //     id: Type.String(),
            //     variants: Type.Array(
            //       Type.Object({
            //         url: Type.String(),
            //         ext: Type.String(),
            //         name: Type.String(),
            //         size: Type.String(),
            //         width: Type.Integer(),
            //         height: Type.Integer(),
            //       }),
            //     ),
            //   }),
            // ),
          }),
        ),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const page = request.query.page
      const storeId = request.params.store_id
      const result = await findProductsByStore.exec(storeId, page)
      if (isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.header('x-has-more', result.success.hasMore).send(result.success.data)
    },
  })
}

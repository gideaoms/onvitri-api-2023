import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { findProduct } from '@/infra/queries/product/find-product.js'
import { isFailure } from '@/utils/either.js'

async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products/:product_id',
    method: 'GET',
    schema: {
      params: Type.Object({
        product_id: Type.String({ format: 'uuid' }),
      }),
      response: {
        200: Type.Object({
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
          store: Type.Object({
            id: Type.String(),
            // fantasy_name: Type.String(),
            // street: Type.String(),
            // number: Type.String(),
            // neighborhood: Type.String(),
            // phone: Type.Object({
            //   country_code: Type.String(),
            //   area_code: Type.String(),
            //   number: Type.String(),
            // }),
            // zip_code: Type.String(),
            status: Type.String(),
          }),
        }),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const productId = request.params.product_id
      const result = await findProduct(productId)
      if (isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send(result.success)
    },
  })
}

export default Controller

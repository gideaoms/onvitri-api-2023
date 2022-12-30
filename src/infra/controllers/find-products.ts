import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { FindProducts } from '@/infra/queries/find-products.js'

const findProducts = new FindProducts()

export default async function Product(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products',
    method: 'GET',
    schema: {
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
        ),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const page = request.query.page
      const result = await findProducts.exec(page)
      return replay.header('x-has-more', result.hasMore).send(result.data)
    },
  })
}

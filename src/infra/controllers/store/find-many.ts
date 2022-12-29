import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { findStores } from '@/infra/queries/store/find-many.js'

async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/stores',
    method: 'GET',
    schema: {
      querystring: Type.Object({
        page: Type.Number(),
      }),
      response: {
        200: Type.Array(
          Type.Intersect([
            Type.Object({
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
            Type.Object({
              city: Type.Object({
                id: Type.String(),
                name: Type.String(),
                initials: Type.String(),
              }),
            }),
          ]),
        ),
      },
    },
    async handler(request, replay) {
      const page = request.query.page
      const result = await findStores(page)
      return replay.header('x-has-more', result.hasMore).send(result.data)
    },
  })
}

export default Controller

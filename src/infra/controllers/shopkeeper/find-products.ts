import { FastifyInstance } from 'fastify'
import { Type } from '@sinclair/typebox'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { FindProducts } from '@/infra/queries/shopkeeper/find-products.js'
import { GuardianProvider } from '@/infra/providers/guardian.js'
import { TokenProvider } from '@/infra/providers/token.js'
import { UserRepository } from '@/infra/repositories/user.js'
import { isFailure } from '@/utils/either.js'

const tokenProvider = new TokenProvider()
const userRepository = new UserRepository()
const guardianProvider = new GuardianProvider(tokenProvider, userRepository)
const findProducts = new FindProducts(guardianProvider)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products',
    method: 'GET',
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
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
              city: Type.Object({
                id: Type.String(),
                name: Type.String(),
                initials: Type.String(),
              }),
            }),
          }),
        ),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const page = request.query.page
      const token = request.headers.authorization
      const result = await findProducts.exec(page, token)
      if (isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.header('x-has-more', result.success.hasMore).send(result.success.data)
    },
  })
}

import { FastifyInstance } from 'fastify'
import { Type } from '@sinclair/typebox'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { FindProduct } from '@/infra/queries/shopkeeper/find-product.js'
import { GuardianProvider } from '@/infra/providers/guardian.js'
import { TokenProvider } from '@/infra/providers/token.js'
import { UserRepository } from '@/infra/repositories/user.js'
import { isFailure } from '@/utils/either.js'

const tokenProvider = new TokenProvider()
const userRepository = new UserRepository()
const guardianProvider = new GuardianProvider(tokenProvider, userRepository)
const findProduct = new FindProduct(guardianProvider)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products/:product_id',
    method: 'GET',
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
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
            city: Type.Object({
              id: Type.String(),
              name: Type.String(),
              initials: Type.String(),
            }),
          }),
        }),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const productId = request.params.product_id
      const token = request.headers.authorization
      const result = await findProduct.exec(productId, token)
      if (isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send(result.success)
    },
  })
}

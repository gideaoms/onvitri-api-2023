import { FastifyInstance } from 'fastify'
import { Type } from '@sinclair/typebox'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import * as FindProducts from '@/infra/queries/shopkeeper/find-products.js'
import * as TokenProvider from '@/infra/providers/token.js'
import * as GuardianProvider from '@/infra/providers/guardian.js'
import * as UserRepository from '@/infra/repositories/user.js'
import * as Either from '@/utils/either.js'

const tokenProvider = new TokenProvider.Provider()
const userRepository = new UserRepository.Repository()
const guardianProvider = new GuardianProvider.Provider(
  tokenProvider,
  userRepository,
)
const findProducts = new FindProducts.Query(guardianProvider)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/shopkeeper/products',
    method: 'GET',
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      querystring: Type.Object({
        page: Type.Number(),
      }),
    },
    async handler(request, replay) {
      const page = request.query.page
      const token = request.headers.authorization
      const result = await findProducts.exec(page, token)
      if (Either.isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay
        .header('x-has-more', result.success.hasMore)
        .send(result.success.data)
    },
  })
}

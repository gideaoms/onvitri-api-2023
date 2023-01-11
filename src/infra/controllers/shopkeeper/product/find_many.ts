import { FastifyInstance } from 'fastify'
import { Type } from '@sinclair/typebox'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import * as Services from '@/infra/queries/shopkeeper/mod.js'
import * as Providers from '@/infra/providers/mod.js'
import * as Repositories from '@/infra/repositories/mod.js'
import * as Either from '@/utils/either.js'

const tokenProvider = new Providers.Token.Provider()
const userRepository = new Repositories.User.Repository()
const guardianProvider = new Providers.Guardian.Provider(tokenProvider, userRepository)
const findProducts = new Services.Product.FindMany.Query(guardianProvider)

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
      return replay.header('x-has-more', result.success.hasMore).send(result.success.data)
    },
  })
}

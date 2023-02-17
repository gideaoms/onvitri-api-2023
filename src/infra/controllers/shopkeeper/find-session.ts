import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as FindSession from '@/core/services/find-session.js'
import * as TokenProvider from '@/infra/providers/token.js'
import * as GuardianProvider from '@/infra/providers/guardian.js'
import * as UserRepository from '@/infra/repositories/user.js'
import * as StoreRepository from '@/infra/repositories/store.js'
import * as Either from '@/utils/either.js'

const tokenProvider = new TokenProvider.Provider()
const userRepository = new UserRepository.Repository()
const guardianProvider = new GuardianProvider.Provider(
  tokenProvider,
  userRepository,
)
const storeRepository = new StoreRepository.Repository()
const findSession = new FindSession.Service(guardianProvider, storeRepository)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/shopkeeper/sessions',
    method: 'GET',
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
    },
    async handler(request, replay) {
      const token = request.headers.authorization
      const result = await findSession.exec(token)
      if (Either.isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send(result.success)
    },
  })
}

import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as CreateSession from '@/core/services/create-session.js'
import * as TokenProvider from '@/infra/providers/token.js'
import * as UserRepository from '@/infra/repositories/user.js'
import * as StoreRepository from '@/infra/repositories/store.js'
import * as Either from '@/utils/either.js'

const userRepository = new UserRepository.Repository()
const tokenProvider = new TokenProvider.Provider()
const storeRepository = new StoreRepository.Repository()
const createSession = new CreateSession.Service(
  userRepository,
  tokenProvider,
  storeRepository,
)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/shopkeeper/sessions',
    method: 'POST',
    schema: {
      body: Type.Object({
        email: Type.String({ format: 'email' }),
        validation_code: Type.String(),
      }),
    },
    async handler(request, replay) {
      const email = request.body.email
      const validationCode = request.body.validation_code
      const result = await createSession.exec(email, validationCode)
      if (Either.isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send(result.success)
    },
  })
}

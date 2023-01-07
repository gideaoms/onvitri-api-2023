import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as Services from '@/core/services/mod.js'
import * as Providers from '@/infra/providers/mod.js'
import * as Repositories from '@/infra/repositories/mod.js'
import * as Either from '@/utils/either.js'

const userRepository = new Repositories.User.Repository()
const tokenProvider = new Providers.Token.Provider()
const createSession = new Services.Session.CreateOne.Service(userRepository, tokenProvider)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/sessions',
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

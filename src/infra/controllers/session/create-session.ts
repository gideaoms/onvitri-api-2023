import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { isFailure } from '@/utils/either.js'
import { CreateSession } from '@/core/services/create-session.js'
import { TokenProvider } from '@/infra/providers/token.js'
import { UserRepository } from '@/infra/repositories/user.js'

const userRepository = new UserRepository()
const tokenProvider = new TokenProvider()
const createSession = new CreateSession(userRepository, tokenProvider)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/sessions',
    method: 'POST',
    schema: {
      body: Type.Object({
        email: Type.String({ format: 'email' }),
        validation_code: Type.String(),
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          name: Type.String(),
          email: Type.String(),
          status: Type.String(),
          token: Type.String(),
        }),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const email = request.body.email
      const validationCode = request.body.validation_code
      const result = await createSession.exec(email, validationCode)
      if (isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send(result.success)
    },
  })
}

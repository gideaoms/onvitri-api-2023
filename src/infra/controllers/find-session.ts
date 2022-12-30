import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { FindSession } from '@/core/services/find-session.js'
import { GuardianProvider } from '@/infra/providers/guardian.js'
import { TokenProvider } from '@/infra/providers/token.js'
import { UserRepository } from '@/infra/repositories/user.js'
import { isFailure } from '@/utils/either.js'

const tokenProvider = new TokenProvider()
const userRepository = new UserRepository()
const guardianProvider = new GuardianProvider(tokenProvider, userRepository)
const findSession = new FindSession(guardianProvider)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/sessions',
    method: 'GET',
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
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
      const token = request.headers.authorization
      const result = await findSession.exec(token)
      if (isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send(result.success)
    },
  })
}

import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as Services from '@/core/services/mod.js'
import * as Providers from '@/infra/providers/mod.js'
import * as Repositories from '@/infra/repositories/mod.js'
import * as Either from '@/utils/either.js'

const userRepository = new Repositories.User.Repository()
const storeRepository = new Repositories.Store.Repository()
const tokenProvider = new Providers.Token.Provider()
const guardianProvider = new Providers.Guardian.Provider(tokenProvider, userRepository)
const createSession = new Services.User.UpdateDefaultStore.Service(
  guardianProvider,
  userRepository,
  storeRepository,
)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/shopkeeper/users/update-default-store',
    method: 'PUT',
    schema: {
      body: Type.Object({
        default_store_id: Type.String({ format: 'uuid' }),
      }),
      headers: Type.Object({
        authorization: Type.String(),
      }),
    },
    async handler(request, replay) {
      const token = request.headers.authorization
      const defaultStoreId = request.body.default_store_id
      const result = await createSession.exec(defaultStoreId, token)
      if (Either.isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send(result.success)
    },
  })
}

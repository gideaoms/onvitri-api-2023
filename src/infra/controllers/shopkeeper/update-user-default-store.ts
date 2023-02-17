import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as UpdateUserDefaultStore from '@/core/services/update-user-default-store.js'
import * as TokenProvider from '@/infra/providers/token.js'
import * as GuardianProvider from '@/infra/providers/guardian.js'
import * as UserRepository from '@/infra/repositories/user.js'
import * as StoreRepository from '@/infra/repositories/store.js'
import * as Either from '@/utils/either.js'

const userRepository = new UserRepository.Repository()
const storeRepository = new StoreRepository.Repository()
const tokenProvider = new TokenProvider.Provider()
const guardianProvider = new GuardianProvider.Provider(
  tokenProvider,
  userRepository,
)
const createSession = new UpdateUserDefaultStore.Service(
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

import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as TokenProvider from '@/infra/providers/token.js'
import * as GuardianProvider from '@/infra/providers/guardian.js'
import * as DriveProvider from '@/infra/providers/drive.js'
import * as StorageProvider from '@/infra/providers/storage.js'
import * as UserRepository from '@/infra/repositories/user.js'
import * as Either from '@/utils/either.js'
import * as CreateImage from '@/core/services/create-image.js'

const tokenProvider = new TokenProvider.Provider()
const userRepository = new UserRepository.Repository()
const guardianProvider = new GuardianProvider.Provider(tokenProvider, userRepository)
const driverProvider = new DriveProvider.Provider()
const storageProvider = new StorageProvider.Provider()
const createImage = new CreateImage.Service(driverProvider, storageProvider, guardianProvider)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/shopkeeper/images',
    method: 'POST',
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
    },
    async handler(request, replay) {
      const token = request.headers.authorization
      const data = await request.file()
      if (!data) {
        return replay.code(400).send({ message: 'Image is required' })
      }
      const result = await createImage.exec(data.file, token)
      if (Either.isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send(result.success)
    },
  })
}

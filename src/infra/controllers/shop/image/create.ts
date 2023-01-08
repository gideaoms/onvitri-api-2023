import fs from 'node:fs'
import crypto from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import * as Providers from '@/infra/providers/mod.js'
import * as Repositories from '@/infra/repositories/mod.js'
import * as Either from '@/utils/either.js'
import * as Models from '@/core/models/mod.js'
import * as Mappers from '@/core/mappers/mod.js'

const tokenProvider = new Providers.Token.Provider()
const userRepository = new Repositories.User.Repository()
const guardianProvider = new Providers.Guardian.Provider(tokenProvider, userRepository)

export default async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/shop/images',
    method: 'POST',
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
    },
    async handler(request, replay) {
      const token = request.headers.authorization
      const user = await guardianProvider.passThrough(token)
      if (Either.isFailure(user)) {
        return replay.code(400).send({ message: user.failure.message })
      }
      const data = await request.file()
      if (!data) {
        return replay.code(400).send({ message: 'Image is required' })
      }
      const mediumMultipartProvider = new Providers.Multipart.Provider({
        width: 1000,
        size: 'md',
        withoutEnlargement: true,
      })
      const medium = await mediumMultipartProvider.create(data.file)
      const readableMedium = fs.createReadStream(mediumMultipartProvider.diskUrl)
      const smallMultipartProvider = new Providers.Multipart.Provider({
        width: 200,
        height: 200,
        size: 'sm',
      })
      const small = await smallMultipartProvider.create(readableMedium)
      const image = new Models.Image.Model({
        id: crypto.randomUUID(),
        variants: [small, medium],
      })
      await fs.promises.unlink(mediumMultipartProvider.diskUrl)
      await fs.promises.unlink(smallMultipartProvider.diskUrl)
      return replay.send(Mappers.Image.toObject(image))
    },
  })
}

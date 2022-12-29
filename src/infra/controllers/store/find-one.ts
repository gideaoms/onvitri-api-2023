import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { FindOne } from '@/core/use-cases/store/find-one.js'
import { PrismaStoreRepository } from '@/infra/repositories/store/prisma.js'
import { isFailure } from '@/utils/either.js'
import { PrismaCityRepository } from '@/infra/repositories/city/prisma.js'
import { PrismaProductRepository } from '@/infra/repositories/product/prisma.js'

const storeRepository = new PrismaStoreRepository()
const cityRepository = new PrismaCityRepository()
const productRepository = new PrismaProductRepository()
const findOne = new FindOne(storeRepository, cityRepository, productRepository)

async function Controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/stores/:store_id',
    method: 'GET',
    schema: {
      params: Type.Object({
        store_id: Type.String({ format: 'uuid' }),
      }),
      response: {
        200: Type.Intersect([
          Type.Object({
            id: Type.String(),
            // fantasy_name: Type.String(),
            // street: Type.String(),
            // number: Type.String(),
            // neighborhood: Type.String(),
            // phone: Type.Object({
            //   country_code: Type.String(),
            //   area_code: Type.String(),
            //   number: Type.String(),
            // }),
            // zip_code: Type.String(),
            status: Type.String(),
          }),
          Type.Object({
            city: Type.Object({
              id: Type.String(),
              name: Type.String(),
              initials: Type.String(),
            }),
            products: Type.Array(
              Type.Object({
                id: Type.String(),
                // store_id: Type.String(),
                // title: Type.String(),
                description: Type.String(),
                // price: Type.Integer(),
                // status: Type.String(),
                // pictures: Type.Array(
                //   Type.Object({
                //     id: Type.String(),
                //     variants: Type.Array(
                //       Type.Object({
                //         url: Type.String(),
                //         ext: Type.String(),
                //         name: Type.String(),
                //         size: Type.String(),
                //         width: Type.Integer(),
                //         height: Type.Integer(),
                //       }),
                //     ),
                //   }),
                // ),
              }),
            ),
          }),
        ]),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const storeId = request.params.store_id
      const result = await findOne.exec(storeId)
      if (isFailure(result)) {
        return replay.code(400).send({ message: result.failure.message })
      }
      return replay.send(result.success)
    },
  })
}

export default Controller

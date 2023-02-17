import { describe, it, expect } from 'vitest'
import errors from 'http-errors'
import * as CreateProduct from '@/core/services/create-product.js'
import * as StoreRepository from '@/tests/fakers/repositories/store.js'
import * as ProductRepository from '@/tests/fakers/repositories/product.js'
import * as GuardianProvider from '@/tests/fakers/providers/guardian.js'
import * as Either from '@/utils/either.js'
import * as StoreModel from '@/core/models/store.js'
import * as CityModel from '@/core/models/city.js'

describe('Create product', () => {
  it('should return an error when token is invalid', async () => {
    const storeRepository = new StoreRepository.Repository()
    const guardianProvider = new GuardianProvider.Provider()
    const productRepository = new ProductRepository.Repository()
    const createProduct = new CreateProduct.Service(
      storeRepository,
      guardianProvider,
      productRepository,
    )
    const token = 'invalid_token'
    const body = {
      storeId: '123',
      description: 'description',
      status: 'active' as const,
      images: [
        {
          id: '123',
          variants: [
            {
              url: 'url',
              name: 'name',
              ext: 'ext',
              width: 1,
              height: 1,
              size: 'mini' as const,
              bucket: 'onvitri',
            },
          ],
        },
      ],
    }
    const result = await createProduct.exec(body, token)
    if (Either.isSuccess(result)) {
      throw new Error('It should not get here')
    }
    expect(result.failure).toStrictEqual(new errors.Unauthorized())
  })

  it('should return an error when store does not exist', async () => {
    const storeRepository = new StoreRepository.Repository()
    const guardianProvider = new GuardianProvider.Provider()
    const productRepository = new ProductRepository.Repository()
    const createProduct = new CreateProduct.Service(
      storeRepository,
      guardianProvider,
      productRepository,
    )
    const token = 'valid_token'
    const body = {
      storeId: 'non_existing_id',
      description: 'description',
      status: 'active' as const,
      images: [
        {
          id: '123',
          variants: [
            {
              url: 'url',
              name: 'name',
              ext: 'ext',
              width: 1,
              height: 1,
              size: 'mini' as const,
              bucket: 'onvitri',
            },
          ],
        },
      ],
    }
    const result = await createProduct.exec(body, token)
    if (Either.isSuccess(result)) {
      throw new Error('It should not get here')
    }
    expect(result.failure).toStrictEqual(new errors.NotFound('Store not found'))
  })

  it('should return an error when the product is active and there is no image', async () => {
    const storeRepository = new StoreRepository.Repository()
    const guardianProvider = new GuardianProvider.Provider()
    const productRepository = new ProductRepository.Repository()
    const createProduct = new CreateProduct.Service(
      storeRepository,
      guardianProvider,
      productRepository,
    )
    const store = StoreModel.build({
      id: '123',
      cityId: '123',
      ownerId: '123',
      fantasyName: 'fantasy name',
      street: 'street',
      number: 'number',
      neighborhood: 'neighborhood',
      phone: {
        countryCode: 'countryCode',
        areaCode: 'areaCode',
        number: 'number',
      },
      status: 'active',
      city: CityModel.build({
        id: '123',
        name: 'any name',
        initials: 'any initials',
      }),
    })
    await storeRepository.create(store)
    const token = 'valid_token'
    const body = {
      storeId: store.id,
      description: 'description',
      status: 'active' as const,
      images: [],
    }
    const result = await createProduct.exec(body, token)
    if (Either.isSuccess(result)) {
      throw new Error('It should not get here')
    }
    expect(result.failure).toStrictEqual(
      new errors.BadRequest('You cannot publish a product without an image'),
    )
  })

  it('should return an error when the product is active and there is more image than allowed', async () => {
    const storeRepository = new StoreRepository.Repository()
    const guardianProvider = new GuardianProvider.Provider()
    const productRepository = new ProductRepository.Repository()
    const createProduct = new CreateProduct.Service(
      storeRepository,
      guardianProvider,
      productRepository,
    )
    const store = StoreModel.build({
      id: '123',
      cityId: '123',
      ownerId: '123',
      fantasyName: 'fantasy name',
      street: 'street',
      number: 'number',
      neighborhood: 'neighborhood',
      phone: {
        countryCode: 'countryCode',
        areaCode: 'areaCode',
        number: 'number',
      },
      status: 'active',
      city: CityModel.build({
        id: '123',
        name: 'any name',
        initials: 'any initials',
      }),
    })
    await storeRepository.create(store)
    const token = 'valid_token'
    const body = {
      storeId: store.id,
      description: 'description',
      status: 'active' as const,
      images: [
        {
          id: '1',
          variants: [],
        },
        {
          id: '2',
          variants: [],
        },
        {
          id: '3',
          variants: [],
        },
        {
          id: '4',
          variants: [],
        },
        {
          id: '5',
          variants: [],
        },
        {
          id: '6',
          variants: [],
        },
        {
          id: '7',
          variants: [],
        },
        {
          id: '8',
          variants: [],
        },
        {
          id: '9',
          variants: [],
        },
        {
          id: '10',
          variants: [],
        },
        {
          id: '11',
          variants: [],
        },
      ],
    }
    const result = await createProduct.exec(body, token)
    if (Either.isSuccess(result)) {
      throw new Error('It should not get here')
    }
    expect(result.failure).toStrictEqual(
      new errors.BadRequest('Your product has more images than allowed'),
    )
  })

  it('should successfully create a product', async () => {
    const storeRepository = new StoreRepository.Repository()
    const guardianProvider = new GuardianProvider.Provider()
    const productRepository = new ProductRepository.Repository()
    const createProduct = new CreateProduct.Service(
      storeRepository,
      guardianProvider,
      productRepository,
    )
    const store = StoreModel.build({
      id: '123',
      cityId: '123',
      ownerId: '123',
      fantasyName: 'fantasy name',
      street: 'street',
      number: 'number',
      neighborhood: 'neighborhood',
      phone: {
        countryCode: 'countryCode',
        areaCode: 'areaCode',
        number: 'number',
      },
      status: 'active',
      city: CityModel.build({
        id: '123',
        name: 'any name',
        initials: 'any initials',
      }),
    })
    await storeRepository.create(store)
    const token = 'valid_token'
    const body = {
      storeId: store.id,
      description: 'description',
      status: 'active' as const,
      images: [
        {
          id: '123',
          variants: [
            {
              url: 'url',
              name: 'name',
              ext: 'ext',
              width: 10,
              height: 10,
              size: 'mini' as const,
              bucket: 'onvitri',
            },
          ],
        },
      ],
    }
    const result = await createProduct.exec(body, token)
    if (Either.isFailure(result)) {
      throw new Error('It should not get here')
    }
    expect(result.success).toStrictEqual({
      id: '1',
      description: 'description',
      status: 'active',
      images: [
        {
          id: '123',
          variants: [
            {
              url: 'url',
              name: 'name',
              ext: 'ext',
              width: 10,
              height: 10,
              size: 'mini',
            },
          ],
        },
      ],
    })
  })
})

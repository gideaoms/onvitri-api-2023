import { describe, it, expect } from 'vitest'
import * as Services from '@/core/services/mod.js'
import * as Repositories from '@/tests/fakers/repositories/mod.js'
import * as Providers from '@/tests/fakers/providers/mod.js'
import * as Either from '@/utils/either.js'
import * as Errors from '@/core/errors/mod.js'
import * as Models from '@/core/models/mod.js'

describe('Create product', () => {
  it('should return an error when token is invalid', async () => {
    const storeRepository = new Repositories.Store.Repository()
    const guardianProvider = new Providers.Guardian.Provider()
    const productRepository = new Repositories.Product.Repository()
    const createProduct = new Services.Product.CreateOne.Service(
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
            },
          ],
        },
      ],
    }
    const result = await createProduct.exec(body, token)
    if (Either.isSuccess(result)) {
      throw new Error('It should not get here')
    }
    expect(result.failure).toStrictEqual(new Errors.Unauthorized.Error('Unauthorized'))
  })

  it('should return an error when store does not exist', async () => {
    const storeRepository = new Repositories.Store.Repository()
    const guardianProvider = new Providers.Guardian.Provider()
    const productRepository = new Repositories.Product.Repository()
    const createProduct = new Services.Product.CreateOne.Service(
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
            },
          ],
        },
      ],
    }
    const result = await createProduct.exec(body, token)
    if (Either.isSuccess(result)) {
      throw new Error('It should not get here')
    }
    expect(result.failure).toStrictEqual(new Errors.NotFound.Error('Store not found'))
  })

  it('should return an error when the product is active and there is no image', async () => {
    const storeRepository = new Repositories.Store.Repository()
    const guardianProvider = new Providers.Guardian.Provider()
    const productRepository = new Repositories.Product.Repository()
    const createProduct = new Services.Product.CreateOne.Service(
      storeRepository,
      guardianProvider,
      productRepository,
    )
    const store = new Models.Store.Model({
      id: '123',
      cityId: '123',
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
      new Errors.BadRequest.Error('You cannot save a product without an image'),
    )
  })

  it('should return an error when the product is active and there is more image than allowed', async () => {
    const storeRepository = new Repositories.Store.Repository()
    const guardianProvider = new Providers.Guardian.Provider()
    const productRepository = new Repositories.Product.Repository()
    const createProduct = new Services.Product.CreateOne.Service(
      storeRepository,
      guardianProvider,
      productRepository,
    )
    const store = new Models.Store.Model({
      id: '123',
      cityId: '123',
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
      new Errors.BadRequest.Error('Your product has more images than allowed'),
    )
  })

  it('should successfully create a product', async () => {
    const storeRepository = new Repositories.Store.Repository()
    const guardianProvider = new Providers.Guardian.Provider()
    const productRepository = new Repositories.Product.Repository()
    const createProduct = new Services.Product.CreateOne.Service(
      storeRepository,
      guardianProvider,
      productRepository,
    )
    const store = new Models.Store.Model({
      id: '123',
      cityId: '123',
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

import { describe, it, expect } from 'vitest'
import errors from 'http-errors'
import * as CreateSession from '@/core/services/create-session.js'
import * as UserRepository from '@/tests/fakers/repositories/user.js'
import * as StoreRepository from '@/tests/fakers/repositories/store.js'
import * as TokenProvider from '@/tests/fakers/providers/token.js'
import * as Either from '@/utils/either.js'
import * as UserModel from '@/core/models/user.js'
import * as StoreModel from '@/core/models/store.js'
import * as CityModel from '@/core/models/city.js'

describe('Create session', () => {
  it('should return an error when email is wrong', async () => {
    const userRepository = new UserRepository.Repository()
    const tokenProvider = new TokenProvider.Provider()
    const storeRepository = new StoreRepository.Repository()
    const createSession = new CreateSession.Service(
      userRepository,
      tokenProvider,
      storeRepository,
    )
    const email = 'invalid_mail'
    const validationCode = 'valid_code'
    const result = await createSession.exec(email, validationCode)
    if (Either.isSuccess(result)) {
      throw new Error('It should not get here')
    }
    expect(result.failure).toStrictEqual(
      new errors.BadRequest('Email e/ou código incorretos'),
    )
  })

  it('should return an error when code is wrong', async () => {
    const userRepository = new UserRepository.Repository()
    const tokenProvider = new TokenProvider.Provider()
    const storeRepository = new StoreRepository.Repository()
    const createSession = new CreateSession.Service(
      userRepository,
      tokenProvider,
      storeRepository,
    )
    const user = UserModel.build({
      id: 'id',
      name: 'name',
      email: 'valid_mail',
      validationCode: 'valid_code',
      status: 'active',
      token: 'token',
    })
    await userRepository.create(user)
    const email = 'valid_mail'
    const validationCode = 'invalid_code'
    const result = await createSession.exec(email, validationCode)
    if (Either.isSuccess(result)) {
      throw new Error('It should not get here')
    }
    expect(result.failure).toStrictEqual(
      new errors.BadRequest('Email e/ou código incorretos'),
    )
  })

  it('should successfully create a new session', async () => {
    const userRepository = new UserRepository.Repository()
    const tokenProvider = new TokenProvider.Provider()
    const storeRepository = new StoreRepository.Repository()
    const createSession = new CreateSession.Service(
      userRepository,
      tokenProvider,
      storeRepository,
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
    const user = UserModel.build({
      id: 'id',
      defaultStoreId: store.id,
      name: 'name',
      email: 'valid_mail',
      validationCode: 'valid_code',
      status: 'active',
      token: 'token',
    })
    await userRepository.create(user)
    const email = 'valid_mail'
    const validationCode = 'valid_code'
    const result = await createSession.exec(email, validationCode)
    if (Either.isFailure(result)) {
      throw new Error('It should not get here')
    }
    expect(result.success).toStrictEqual({
      id: '1',
      default_store_id: '1',
      email: 'valid_mail',
      name: 'name',
      status: 'active',
      token: 'valid_token',
      default_store: {
        id: '1',
        city_id: '123',
        owner_id: '123',
        fantasy_name: 'fantasy name',
        neighborhood: 'neighborhood',
        number: 'number',
        phone: {
          area_code: 'areaCode',
          country_code: 'countryCode',
          number: 'number',
        },
        status: 'active',
        street: 'street',
        city: {
          id: '123',
          initials: 'any initials',
          name: 'any name',
        },
      },
    })
  })
})

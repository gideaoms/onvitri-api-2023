import { describe, it, expect } from 'vitest'
import errors from 'http-errors'
import * as Services from '@/core/services/mod.js'
import * as Repositories from '@/tests/fakers/repositories/mod.js'
import * as Providers from '@/tests/fakers/providers/mod.js'
import * as Either from '@/utils/either.js'
import * as Models from '@/core/models/mod.js'

describe('Create session', () => {
  it('should return an error when email is wrong', async () => {
    const userRepository = new Repositories.User.Repository()
    const tokenProvider = new Providers.Token.Provider()
    const createSession = new Services.Session.CreateOne.Service(userRepository, tokenProvider)
    const email = 'invalid_mail'
    const validationCode = 'valid_code'
    const result = await createSession.exec(email, validationCode)
    if (Either.isSuccess(result)) {
      throw new Error('It should not get here')
    }
    expect(result.failure).toStrictEqual(new errors.BadRequest('Email e/ou código incorretos'))
  })

  it('should return an error when code is wrong', async () => {
    const userRepository = new Repositories.User.Repository()
    const tokenProvider = new Providers.Token.Provider()
    const createSession = new Services.Session.CreateOne.Service(userRepository, tokenProvider)
    const user = new Models.User.Model({
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
    expect(result.failure).toStrictEqual(new errors.BadRequest('Email e/ou código incorretos'))
  })

  it('should successfully create a new session', async () => {
    const userRepository = new Repositories.User.Repository()
    const tokenProvider = new Providers.Token.Provider()
    const createSession = new Services.Session.CreateOne.Service(userRepository, tokenProvider)
    const user = new Models.User.Model({
      id: 'id',
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
      email: 'valid_mail',
      name: 'name',
      status: 'active',
      token: 'valid_token',
    })
  })
})

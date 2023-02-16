import errors from 'http-errors'
import * as GuardianProvider from '@/core/providers/guardian.js'
import * as Either from '@/utils/either.js'
import * as UserModel from '@/core/models/user.js'

export class Provider implements GuardianProvider.Provider {
  async passThrough(token: string) {
    const isValid = token === 'valid_token'
    if (!isValid) {
      return Either.failure(new errors.Unauthorized())
    }
    return Either.success(
      UserModel.build({
        id: '123',
        name: 'John Doe',
        email: 'john@mail.com',
        status: 'active',
        token: token,
      }),
    )
  }
}

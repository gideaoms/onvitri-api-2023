import { IGuardianProvider } from '@/core/providers/guardian.js'
import { failure, isFailure, success } from '@/utils/either.js'

export class FindSession {
  private readonly guardianProvider: IGuardianProvider

  public constructor(guardianProvider: IGuardianProvider) {
    this.guardianProvider = guardianProvider
  }

  public async exec(token: string) {
    const user = await this.guardianProvider.passThrough(token)
    if (isFailure(user)) {
      return failure(user.failure)
    }
    return success({
      id: user.success.id,
      name: user.success.name,
      email: user.success.email,
      status: user.success.status,
      token: user.success.token,
    })
  }
}

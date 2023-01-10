import { Readable } from 'stream'
import fs from 'node:fs'
import crypto from 'node:crypto'
import * as Providers from '@/core/providers/mod.js'
import * as Either from '@/utils/either.js'
import * as Models from '@/core/models/mod.js'
import * as Mappers from '@/core/mappers/mod.js'

export class Service {
  constructor(
    private readonly _driveProvider: Providers.Drive.Provider,
    private readonly _storageProvider: Providers.Storage.Provider,
    private readonly _guardianProvider: Providers.Guardian.Provider,
  ) {}

  async exec(normalReadableVariant: Readable, token: string) {
    const user = await this._guardianProvider.passThrough(token)
    if (Either.isFailure(user)) {
      return Either.failure(user.failure)
    }
    const normalDriveVariant = await this._driveProvider.create({
      readable: normalReadableVariant,
      width: 1000,
      size: 'normal',
    })
    const normalStorageVariant = await this._storageProvider.create(normalDriveVariant)
    const miniReadableVariant = fs.createReadStream(normalDriveVariant.url)
    const miniDriveVariant = await this._driveProvider.create({
      readable: miniReadableVariant,
      width: 200,
      height: 200,
      size: 'mini',
    })
    const miniStorageVariant = await this._storageProvider.create(miniDriveVariant)
    const image = new Models.Image.Model({
      id: crypto.randomUUID(),
      variants: [normalStorageVariant, miniStorageVariant],
    })
    await fs.promises.unlink(normalDriveVariant.url)
    await fs.promises.unlink(miniDriveVariant.url)
    return Either.success(Mappers.Image.toObject(image))
  }
}

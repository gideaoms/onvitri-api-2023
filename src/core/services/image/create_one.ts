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

  async exec(readable: Readable, token: string) {
    const user = await this._guardianProvider.passThrough(token)
    if (Either.isFailure(user)) {
      return Either.failure(user.failure)
    }
    const normalDriveImage = await this._driveProvider.create({
      readable: readable,
      width: 1000,
      size: 'normal',
    })
    const normalStorageImage = await this._storageProvider.create(normalDriveImage)
    const miniDriveImage = await this._driveProvider.create({
      readable: fs.createReadStream(normalDriveImage.url),
      width: 200,
      height: 200,
      size: 'mini',
    })
    const miniStorageImage = await this._storageProvider.create(miniDriveImage)
    const image = new Models.Image.Model({
      id: crypto.randomUUID(),
      variants: [normalStorageImage, miniStorageImage],
    })
    await fs.promises.unlink(normalDriveImage.url)
    await fs.promises.unlink(miniDriveImage.url)
    return Either.success(Mappers.Image.toObject(image))
  }
}

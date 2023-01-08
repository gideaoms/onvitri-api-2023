import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import crypto from 'node:crypto'
import stream from 'node:stream/promises'
import sharp from 'sharp'
import aws from 'aws-sdk'
import format from 'date-fns/format'
import { Readable } from 'node:stream'
import * as Providers from '@/core/providers/mod.js'
import * as Models from '@/core/models/mod.js'
import * as Config from '@/config.js'

const s3 = new aws.S3({
  endpoint: Config.AWS_S3_ENDPOINT,
  region: 'sfo3',
  credentials: {
    accessKeyId: Config.AWS_ACCESS_KEY_ID,
    secretAccessKey: Config.AWS_SECRET_ACCESS_KEY,
  },
})

export class Provider implements Providers.Multipart.Provider {
  readonly extension = 'webp'
  readonly name = `${crypto.randomBytes(50).toString('hex')}.${this.extension}`
  readonly diskUrl = path.join(os.tmpdir(), this.name)
  private readonly _width: number
  private readonly _height?: number
  private readonly _size: Models.Variant.Size
  private readonly _withoutEnlargement?: boolean

  constructor(args: {
    width: number
    height?: number
    size: Models.Variant.Size
    withoutEnlargement?: boolean
  }) {
    this._width = args.width
    this._height = args.height
    this._size = args.size
    this._withoutEnlargement = args.withoutEnlargement
  }

  async create(file: Readable) {
    const transformer = sharp({ failOn: 'none' })
      .resize({
        width: this._width,
        height: this._height,
        withoutEnlargement: this._withoutEnlargement,
      })
      .webp()
    await stream.pipeline(file, transformer, fs.createWriteStream(this.diskUrl))
    const metadata = await sharp(this.diskUrl).metadata()
    if (!metadata.width || !metadata.height) {
      throw new Error('Error while getting width and height metadata')
    }
    const folder = format(new Date(), 'yyyy-MM-dd')
    await s3
      .putObject({
        Bucket: `${Config.AWS_S3_NAME}/${folder}`,
        Key: this.name,
        ACL: 'public-read',
        Body: fs.createReadStream(this.diskUrl),
        ContentType: 'image/webp',
      })
      .promise()
    return new Models.Variant.Model({
      url: `https://${Config.AWS_S3_NAME}.${Config.AWS_S3_ENDPOINT}/${folder}/${this.name}`,
      name: this.name,
      ext: this.extension,
      width: metadata.width,
      height: metadata.height,
      size: this._size,
    })
  }
}

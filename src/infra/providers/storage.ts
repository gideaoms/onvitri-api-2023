import fs from 'node:fs'
import aws from 'aws-sdk'
import format from 'date-fns/format'
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

export class Provider implements Providers.Storage.Provider {
  async create(variant: Models.Variant.Model) {
    const folder = format(new Date(), 'yyyy-MM-dd')
    const bucket = `${Config.AWS_S3_NAME}/${folder}`
    await s3
      .putObject({
        Bucket: bucket,
        Key: variant.name,
        ACL: 'public-read',
        Body: fs.createReadStream(variant.url),
        ContentType: 'image/webp',
      })
      .promise()
    return new Models.Variant.Model({
      url: `https://${Config.AWS_S3_NAME}.${Config.AWS_S3_ENDPOINT}/${folder}/${variant.name}`,
      name: variant.name,
      ext: variant.ext,
      width: variant.width,
      height: variant.height,
      size: variant.size,
      bucket: bucket,
    })
  }

  async remove(variant: Models.Variant.Model) {
    await s3
      .deleteObject({
        Bucket: variant.bucket,
        Key: variant.name,
      })
      .promise()
  }
}

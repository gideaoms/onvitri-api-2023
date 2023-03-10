import fs from 'node:fs'
import aws from 'aws-sdk'
import fns from 'date-fns'
import * as StorageProvider from '@/core/providers/storage.js'
import * as VariantModel from '@/core/models/variant.js'
import config from '@/config.js'

const s3 = new aws.S3({
  endpoint: config.AWS_S3_ENDPOINT,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
})

export class Provider implements StorageProvider.Provider {
  async create(variant: VariantModel.Model) {
    const folder = fns.format(new Date(), 'yyyy-MM-dd')
    const bucket = `${config.AWS_S3_BUCKET}/${folder}`
    await s3
      .putObject({
        Bucket: bucket,
        Key: variant.name,
        ACL: 'public-read',
        Body: fs.createReadStream(variant.url),
        ContentType: 'image/webp',
      })
      .promise()
    const url = `https://${config.AWS_S3_BUCKET}.${config.AWS_S3_ENDPOINT}/${folder}/${variant.name}`
    return VariantModel.build({
      url: url,
      name: variant.name,
      ext: variant.ext,
      width: variant.width,
      height: variant.height,
      size: variant.size,
      bucket: bucket,
    })
  }

  async remove(variant: VariantModel.Model) {
    await s3
      .deleteObject({
        Bucket: variant.bucket,
        Key: variant.name,
      })
      .promise()
  }
}

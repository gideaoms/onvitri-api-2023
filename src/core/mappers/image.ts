import * as ImageModel from '@/core/models/image.js'

export function toObject(model: ImageModel.Model) {
  return {
    id: model.id,
    variants: model.variants.map(variant => ({
      url: variant.url,
      name: variant.name,
      ext: variant.ext,
      width: variant.width,
      height: variant.height,
      size: variant.size,
      bucket: variant.bucket,
    })),
  }
}

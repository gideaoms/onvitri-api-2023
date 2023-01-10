import * as Models from '@/core/models/mod.js'

export function toObject(model: Models.Image.Model) {
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

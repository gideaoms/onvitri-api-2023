import * as Models from '@/core/models/mod.js'

export function toObject(model: Models.Product.Model) {
  return {
    id: model.id,
    description: model.description,
    status: model.status,
    images: model.images.map(image => ({
      id: image.id,
      variants: image.variants.map(variant => ({
        url: variant.url,
        name: variant.name,
        ext: variant.ext,
        width: variant.width,
        height: variant.height,
        size: variant.size,
      })),
    })),
  }
}

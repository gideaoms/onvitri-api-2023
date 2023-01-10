import * as Models from '@/core/models/mod.js'
import * as Image from '@/core/mappers/image.js'

export function toObject(model: Models.Product.Model) {
  return {
    id: model.id,
    description: model.description,
    status: model.status,
    images: model.images.map(Image.toObject),
  }
}

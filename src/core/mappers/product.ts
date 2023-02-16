import * as ProductModel from '@/core/models/product.js'
import * as ImageMapper from '@/core/mappers/image.js'

export function toObject(model: ProductModel.Model) {
  return {
    id: model.id,
    description: model.description,
    status: model.status,
    images: model.images.map(ImageMapper.toObject),
  }
}

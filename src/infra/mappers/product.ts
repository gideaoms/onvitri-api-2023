import { Product } from '@prisma/client'
import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import * as Models from '@/core/models/mod.js'

const ImageSchema = Type.Array(
  Type.Object({
    id: Type.String(),
    variants: Type.Array(
      Type.Object({
        url: Type.String(),
        name: Type.String(),
        ext: Type.String(),
        width: Type.Number(),
        height: Type.Number(),
        size: Type.Enum({ sm: 'sm' as const, md: 'md' as const }),
      }),
    ),
  }),
)

export function toModel(record: Product) {
  if (!Value.Check(ImageSchema, record.images)) {
    throw new Error('Invalid images field')
  }
  return new Models.Product.Model({
    id: record.id,
    storeId: record.store_id,
    description: record.description,
    status: record.status,
    images: record.images.map(
      image =>
        new Models.Image.Model({
          id: image.id,
          variants: image.variants,
        }),
    ),
  })
}

export function toObject(record: Product) {
  if (!Value.Check(ImageSchema, record.images)) {
    throw new Error('Invalid images field')
  }
  return {
    id: record.id,
    description: record.description,
    status: record.status,
    images: record.images,
  }
}

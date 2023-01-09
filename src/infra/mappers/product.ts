import { Prisma, Product } from '@prisma/client'
import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import * as Models from '@/core/models/mod.js'

const schema = Type.Array(
  Type.Object({
    id: Type.String(),
    variants: Type.Array(
      Type.Object({
        url: Type.String(),
        name: Type.String(),
        ext: Type.String(),
        width: Type.Number(),
        height: Type.Number(),
        size: Type.Enum({ mini: 'mini' as const, normal: 'normal' as const }),
      }),
    ),
  }),
)

function toImages(images: Prisma.JsonValue) {
  if (!Value.Check(schema, images)) {
    throw new Error('Invalid images field', { cause: images })
  }
  return images
}

export function toModel(record: Product) {
  const images = toImages(record.images)
  return new Models.Product.Model({
    id: record.id,
    storeId: record.store_id,
    description: record.description,
    status: record.status,
    images: images.map(
      image =>
        new Models.Image.Model({
          id: image.id,
          variants: image.variants.map(
            variant =>
              new Models.Variant.Model({
                url: variant.url,
                name: variant.name,
                ext: variant.ext,
                width: variant.width,
                height: variant.height,
                size: variant.size,
              }),
          ),
        }),
    ),
  })
}

export function toObject(record: Product) {
  const images = toImages(record.images)
  return {
    id: record.id,
    description: record.description,
    status: record.status,
    images: images.map(image => ({
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

export function fromModel(model: Models.Product.Model) {
  return {
    id: model.id,
    store_id: model.storeId,
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
